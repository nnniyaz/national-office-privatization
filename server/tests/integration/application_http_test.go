package integration

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/enterprise"
	applicationHttp "github.com/nnniyaz/nop/server/handler/http/application"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	applicationService "github.com/nnniyaz/nop/server/service/application"
	enterpriseService "github.com/nnniyaz/nop/server/service/enterprise"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/xuri/excelize/v2"
)

// mockEmail is a no-op email sender for tests
type mockEmail struct{}

func (m *mockEmail) SendMail(to []string, subject string, htmlBody string) error {
	return nil
}

func mustParseTime(t *testing.T, value string) time.Time {
	t.Helper()
	parsed, err := time.Parse(time.RFC3339, value)
	require.NoError(t, err)
	return parsed
}

// newTestApplicationHandler creates a test HTTP handler without external dependencies
func newTestApplicationHandler(t *testing.T) (http.Handler, *MockApplicationRepo, *MockEnterpriseRepo) {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockAppRepo := NewMockApplicationRepo()
	mockEnterpriseRepo := NewMockEnterpriseRepo()

	entSvc := enterpriseService.NewEnterpriseService(l, mockEnterpriseRepo)
	svc := applicationService.NewApplicationService(l, mockAppRepo, &mockEmail{}, entSvc)

	delivery := applicationHttp.NewHttpDelivery(l, svc)

	r := chi.NewRouter()

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx = context.WithValue(ctx, "traceId", "test-trace-id")
			mockRequestInfo := web.RequestInfo{
				Timestamp:    time.Now(),
				RemoteAddr:   "127.0.0.1:12345",
				Referrer:     "",
				UserAgentRaw: "test-agent",
				UserAgent:    web.UserAgent{},
			}
			ctx = context.WithValue(ctx, "requestInfo", mockRequestInfo)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})

	r.Get("/api/application", delivery.GetApplications)
	r.Get("/api/application/export", delivery.ExportApplications)
	r.Get("/api/application/{application_id}", delivery.GetApplicationById)

	return r, mockAppRepo, mockEnterpriseRepo
}

func newTestEnterprise(t *testing.T) *enterprise.Enterprise {
	t.Helper()
	e, err := enterprise.NewEnterprise(
		"ТОО «Тест»",
		"г. Алматы",
		"IT",
		100.0,
		"ТОО",
		2020,
		"Государство",
		"Разработка ПО",
		0, "",
		0, "",
		0, "",
		0, "",
		0, "",
		0, "",
		0, "",
		"", "", "", "", "", "", "", "",
	)
	require.NoError(t, err)
	return e
}

func seedApplication(t *testing.T, repo *MockApplicationRepo, enterpriseId, fio string, createdAt time.Time) {
	t.Helper()
	a := application.UnmarshalApplicationFromDatabase(
		uuid.NewUUID(),
		enterpriseId,
		fio,
		"123456789012",
		"+77001234567",
		"test@example.com",
		"Хочу приобрести объект",
		createdAt,
		createdAt,
	)
	require.NoError(t, repo.Create(context.Background(), a))
}

func exportRows(t *testing.T, h http.Handler, url string) [][]string {
	t.Helper()

	req := httptest.NewRequest(http.MethodGet, url, nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)
	assert.Equal(t, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", rec.Header().Get("Content-Type"))
	assert.Contains(t, rec.Header().Get("Content-Disposition"), "attachment")

	f, err := excelize.OpenReader(bytes.NewReader(rec.Body.Bytes()))
	require.NoError(t, err)
	defer f.Close()

	rows, err := f.GetRows("Заявки")
	require.NoError(t, err)
	return rows
}

func TestExportApplications_All_HTTP(t *testing.T) {
	t.Parallel()

	h, appRepo, entRepo := newTestApplicationHandler(t)

	e := newTestEnterprise(t)
	require.NoError(t, entRepo.Create(context.Background(), e))

	seedApplication(t, appRepo, e.GetID().String(), "Иванов Иван", mustParseTime(t, "2026-07-01T10:00:00Z"))
	seedApplication(t, appRepo, e.GetID().String(), "Петров Пётр", mustParseTime(t, "2026-07-15T10:00:00Z"))
	seedApplication(t, appRepo, e.GetID().String(), "Сидоров Сидор", mustParseTime(t, "2026-07-29T10:00:00Z"))

	rows := exportRows(t, h, "/api/application/export")

	require.Len(t, rows, 4) // заголовок + 3 заявки
	assert.Equal(t, []string{"№", "Дата создания", "ФИО", "ИИН/БИН", "Телефон", "Email", "Наименование объекта", "Сообщение"}, rows[0])
	// сортировка по дате создания по возрастанию
	assert.Equal(t, "Иванов Иван", rows[1][2])
	assert.Equal(t, "Петров Пётр", rows[2][2])
	assert.Equal(t, "Сидоров Сидор", rows[3][2])
	// имя предприятия резолвится по enterpriseId
	assert.Equal(t, "ТОО «Тест»", rows[1][6])
}

func TestExportApplications_Period_HTTP(t *testing.T) {
	t.Parallel()

	h, appRepo, entRepo := newTestApplicationHandler(t)

	e := newTestEnterprise(t)
	require.NoError(t, entRepo.Create(context.Background(), e))

	seedApplication(t, appRepo, e.GetID().String(), "Иванов Иван", mustParseTime(t, "2026-07-01T10:00:00Z"))
	seedApplication(t, appRepo, e.GetID().String(), "Петров Пётр", mustParseTime(t, "2026-07-15T10:00:00Z"))
	seedApplication(t, appRepo, e.GetID().String(), "Сидоров Сидор", mustParseTime(t, "2026-07-29T10:00:00Z"))

	rows := exportRows(t, h, "/api/application/export?from=2026-07-10T00:00:00Z&to=2026-07-20T23:59:59Z")

	require.Len(t, rows, 2) // заголовок + 1 заявка за период
	assert.Equal(t, "Петров Пётр", rows[1][2])
}

func TestExportApplications_UnknownEnterprise_HTTP(t *testing.T) {
	t.Parallel()

	h, appRepo, _ := newTestApplicationHandler(t)

	unknownId := uuid.NewUUID().String()
	seedApplication(t, appRepo, unknownId, "Иванов Иван", mustParseTime(t, "2026-07-01T10:00:00Z"))

	rows := exportRows(t, h, "/api/application/export")

	// удалённое предприятие не валит выгрузку — в колонке остаётся id
	require.Len(t, rows, 2)
	assert.Equal(t, unknownId, rows[1][6])
}

func TestExportApplications_InvalidPeriod_HTTP(t *testing.T) {
	t.Parallel()

	h, _, _ := newTestApplicationHandler(t)

	req := httptest.NewRequest(http.MethodGet, "/api/application/export?from=not-a-date", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestExportApplications_RepoError_HTTP(t *testing.T) {
	t.Parallel()

	h, appRepo, _ := newTestApplicationHandler(t)
	appRepo.FailWith(errors.New("mongo is down"))

	req := httptest.NewRequest(http.MethodGet, "/api/application/export", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusInternalServerError, rec.Code)
}

func TestExportApplications_Empty_HTTP(t *testing.T) {
	t.Parallel()

	h, _, _ := newTestApplicationHandler(t)

	rows := exportRows(t, h, "/api/application/export")

	// пустой результат — корректный файл только с заголовком
	require.Len(t, rows, 1)
}
