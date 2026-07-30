package application

import (
	"bytes"
	"context"
	"fmt"
	"time"

	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/pkg/email"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
	"github.com/nnniyaz/nop/server/service/enterprise"
	"github.com/xuri/excelize/v2"
	"go.uber.org/zap"
)

type ApplicationService interface {
	Get(ctx context.Context) ([]*application.Application, error)
	GetById(ctx context.Context, applicationId string) (*application.Application, error)
	Export(ctx context.Context, from, to *time.Time) ([]byte, error)
	Create(ctx context.Context, enterpriseId, fio, bin, phone, email, message string) error
	Update(ctx context.Context, applicationId, enterpriseId, fio, bin, phone, email, message string) error
	Delete(ctx context.Context, applicationId string) error
}

type applicationService struct {
	logger            logger.Logger
	repo              repo.Application
	emailService      email.Email
	enterpriseService enterprise.EnterpriseService
}

func NewApplicationService(l logger.Logger, repo repo.Application, emailService email.Email, enterpriseService enterprise.EnterpriseService) ApplicationService {
	return &applicationService{logger: l, repo: repo, emailService: emailService, enterpriseService: enterpriseService}
}

func (s *applicationService) Get(ctx context.Context) ([]*application.Application, error) {
	return s.repo.Get(ctx)
}

func (s *applicationService) GetById(ctx context.Context, applicationId string) (*application.Application, error) {
	convertedId, err := uuid.UUIDFromString(applicationId)
	if err != nil {
		return nil, err
	}
	return s.repo.GetById(ctx, convertedId)
}

func (s *applicationService) Export(ctx context.Context, from, to *time.Time) ([]byte, error) {
	applications, err := s.repo.GetByPeriod(ctx, from, to)
	if err != nil {
		return nil, err
	}

	// имя объекта резолвим по уникальным id; удалённое предприятие не должно валить выгрузку
	enterpriseNames := map[string]string{}
	for _, a := range applications {
		if _, ok := enterpriseNames[a.GetEnterpriseId()]; ok {
			continue
		}
		e, err := s.enterpriseService.GetById(ctx, a.GetEnterpriseId())
		if err != nil {
			if ctx.Err() != nil {
				return nil, ctx.Err()
			}
			s.logger.Error("export: failed to resolve enterprise name, falling back to id", zap.String("enterpriseId", a.GetEnterpriseId()), zap.Error(err))
			enterpriseNames[a.GetEnterpriseId()] = a.GetEnterpriseId()
			continue
		}
		enterpriseNames[a.GetEnterpriseId()] = e.GetName()
	}

	return buildExportFile(applications, enterpriseNames)
}

var exportHeaders = []string{"№", "Дата создания", "ФИО", "ИИН/БИН", "Телефон", "Email", "Наименование объекта", "Сообщение"}

func buildExportFile(applications []*application.Application, enterpriseNames map[string]string) ([]byte, error) {
	f := excelize.NewFile()
	defer f.Close()

	const sheet = "Заявки"
	if err := f.SetSheetName("Sheet1", sheet); err != nil {
		return nil, err
	}

	headerStyle, err := f.NewStyle(&excelize.Style{Font: &excelize.Font{Bold: true}})
	if err != nil {
		return nil, err
	}
	for i, h := range exportHeaders {
		cell, err := excelize.CoordinatesToCellName(i+1, 1)
		if err != nil {
			return nil, err
		}
		if err := f.SetCellValue(sheet, cell, h); err != nil {
			return nil, err
		}
	}
	if err := f.SetRowStyle(sheet, 1, 1, headerStyle); err != nil {
		return nil, err
	}

	// админы работают в казахстанском времени (UTC+5); при отсутствии tzdata остаёмся в UTC
	loc, err := time.LoadLocation("Asia/Almaty")
	if err != nil {
		loc = time.UTC
	}

	for i, a := range applications {
		row := []interface{}{
			i + 1,
			a.GetCreatedAt().In(loc).Format("2006-01-02 15:04:05"),
			a.GetFio(),
			a.GetBin(),
			a.GetPhone(),
			a.GetEmail(),
			enterpriseNames[a.GetEnterpriseId()],
			a.GetMessage(),
		}
		cell, err := excelize.CoordinatesToCellName(1, i+2)
		if err != nil {
			return nil, err
		}
		if err := f.SetSheetRow(sheet, cell, &row); err != nil {
			return nil, err
		}
	}

	widths := []float64{6, 20, 30, 16, 18, 28, 40, 60}
	for i, w := range widths {
		col, err := excelize.ColumnNumberToName(i + 1)
		if err != nil {
			return nil, err
		}
		if err := f.SetColWidth(sheet, col, col, w); err != nil {
			return nil, err
		}
	}

	var buf bytes.Buffer
	if err := f.Write(&buf); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (s *applicationService) Create(ctx context.Context, enterpriseId, fio, bin, phone, email, message string) error {
	a, err := application.NewApplication(enterpriseId, fio, bin, phone, email, message)
	if err != nil {
		return err
	}

	enterprise, err := s.enterpriseService.GetById(ctx, enterpriseId)
	if err != nil {
		return err
	}

	subject := "Запрос об объекте с веб-сайта НОП"
	htmlBody := fmt.Sprintf("<p>Дата и время запроса: %s,</p><p>Запрос от <strong>%s</strong></p><p>Наименование объекта: %s</p><p>ИИН/БИН запросителя: %s</p><p>Контакты запросителя: %s, %s</p><p>Cообщение запросителя: <br/>%s</p>", a.GetCreatedAt().Format("2006-01-02 15:04:05"), a.GetFio(), enterprise.GetName(), a.GetBin(), a.GetPhone(), a.GetEmail(), a.GetMessage())
	err = s.emailService.SendMail([]string{"k.kense.azrk@azrk.gov.kz"}, subject, htmlBody)
	if err != nil {
		return err
	}

	return s.repo.Create(ctx, a)
}

func (s *applicationService) Update(ctx context.Context, applicationId, enterpriseId, fio, bin, phone, email, message string) error {
	convertedId, err := uuid.UUIDFromString(applicationId)
	if err != nil {
		return err
	}
	a, err := s.repo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err = a.Update(enterpriseId, fio, bin, phone, email, message); err != nil {
		return err
	}
	return s.repo.Update(ctx, a)
}

func (s *applicationService) Delete(ctx context.Context, applicationId string) error {
	convertedId, err := uuid.UUIDFromString(applicationId)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, convertedId)
}
