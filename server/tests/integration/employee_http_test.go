package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/handler/http/employee"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	employeeService "github.com/nnniyaz/nop/server/service/employee"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestEmployeeHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockEmployeeRepo()
	svc := employeeService.NewEmployeeService(l, mockRepo)
	delivery := employee.NewHttpDelivery(l, svc)

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

	r.Get("/api/employee", delivery.GetEmployees)
	r.Get("/api/employee/{employee_id}", delivery.GetEmployeeById)
	r.Post("/api/employee", delivery.CreateEmployee)
	r.Put("/api/employee", delivery.UpdateEmployee)
	r.Delete("/api/employee/{employee_id}", delivery.DeleteEmployee)

	return r
}

func TestCreateEmployee_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEmployeeHandler(t)

	body := map[string]interface{}{
		"name":  map[string]string{"en": "Test Employee"},
		"group": "Management",
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/employee", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)
}

func TestGetEmployees_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEmployeeHandler(t)

	createBody := map[string]interface{}{
		"name":  map[string]string{"en": "Employee"},
		"group": "IT",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/employee", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	req := httptest.NewRequest(http.MethodGet, "/api/employee", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Employees []interface{} `json:"employees"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.Employees)
}

func TestUpdateEmployee_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEmployeeHandler(t)

	createBody := map[string]interface{}{
		"name":  map[string]string{"en": "Old Employee"},
		"group": "OldGroup",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/employee", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/employee", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Employees []struct {
				ID string `json:"id"`
			} `json:"employees"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	employeeId := getAllResp.Data.Employees[0].ID

	updateBody := map[string]interface{}{
		"id":    employeeId,
		"name":  map[string]string{"en": "New Employee"},
		"group": "NewGroup",
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/employee", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)
}

func TestDeleteEmployee_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEmployeeHandler(t)

	createBody := map[string]interface{}{
		"name":  map[string]string{"en": "To Delete"},
		"group": "DeleteGroup",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/employee", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/employee", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Employees []struct {
				ID string `json:"id"`
			} `json:"employees"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	employeeId := getAllResp.Data.Employees[0].ID

	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/employee/"+employeeId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)
}

