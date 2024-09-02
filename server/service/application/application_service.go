package application

import (
	"context"
	"fmt"
	"github.com/nnniyaz/nop/domain/application"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/pkg/email"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
	"github.com/nnniyaz/nop/service/enterprise"
)

type ApplicationService interface {
	Get(ctx context.Context) ([]*application.Application, error)
	GetById(ctx context.Context, applicationId string) (*application.Application, error)
	Create(ctx context.Context, enterpriseId, fio, bin, contact, message string) error
	Update(ctx context.Context, applicationId, enterpriseId, fio, bin, contact, message string) error
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

func (s *applicationService) Create(ctx context.Context, enterpriseId, fio, bin, contact, message string) error {
	a, err := application.NewApplication(enterpriseId, fio, bin, contact, message)
	if err != nil {
		return err
	}

	enterprise, err := s.enterpriseService.GetById(ctx, enterpriseId)
	if err != nil {
		return err
	}

	subject := "Запрос об объекте с веб-сайта НОП"
	htmlBody := fmt.Sprintf("<p>Дата и время запроса: %s,</p><p>Запрос от <strong>%s</strong></p><p>Наименование объекта: %s</p><p>ИИН/БИН запросителя: %s</p><p>Контакты запросителя: %s</p><p>Cообщение запросителя: <br/>%s</p>", a.GetCreatedAt().Format("2006-01-02 15:04:05"), a.GetFio(), enterprise.GetName(), a.GetBin(), a.GetContact(), a.GetMessage())
	err = s.emailService.SendMail([]string{"k.kense.azrk@azrk.gov.kz"}, subject, htmlBody)
	if err != nil {
		return err
	}

	return s.repo.Create(ctx, a)
}

func (s *applicationService) Update(ctx context.Context, applicationId, enterpriseId, fio, bin, contact, message string) error {
	convertedId, err := uuid.UUIDFromString(applicationId)
	if err != nil {
		return err
	}
	a, err := s.repo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err = a.Update(enterpriseId, fio, bin, contact, message); err != nil {
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
