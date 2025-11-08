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
	"github.com/nnniyaz/nop/server/handler/http/partner"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	partnerService "github.com/nnniyaz/nop/server/service/partner"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestPartnerHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockPartnerRepo()
	svc := partnerService.NewPartnerService(l, mockRepo)
	delivery := partner.NewHttpDelivery(l, svc)

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

	r.Get("/api/partner", delivery.GetPartners)
	r.Get("/api/partner/{partner_id}", delivery.GetPartnerById)
	r.Post("/api/partner", delivery.CreatePartner)
	r.Put("/api/partner", delivery.UpdatePartner)
	r.Delete("/api/partner/{partner_id}", delivery.DeletePartner)

	return r
}

func TestCreatePartner_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestPartnerHandler(t)

	body := map[string]interface{}{
		"name": map[string]string{"en": "Test Partner"},
		"link": "https://partner.com",
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/partner", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)
}

func TestCreatePartner_HTTP_EmptyLink_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestPartnerHandler(t)

	body := map[string]interface{}{
		"name": map[string]string{"en": "Partner"},
		"link": "",
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/partner", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestGetPartners_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestPartnerHandler(t)

	createBody := map[string]interface{}{
		"name": map[string]string{"en": "Partner"},
		"link": "https://example.com",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/partner", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	req := httptest.NewRequest(http.MethodGet, "/api/partner", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Partners []interface{} `json:"partners"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.Partners)
}

func TestUpdatePartner_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestPartnerHandler(t)

	createBody := map[string]interface{}{
		"name": map[string]string{"en": "Old Partner"},
		"link": "https://old.com",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/partner", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/partner", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Partners []struct {
				ID string `json:"id"`
			} `json:"partners"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	partnerId := getAllResp.Data.Partners[0].ID

	updateBody := map[string]interface{}{
		"id":   partnerId,
		"name": map[string]string{"en": "New Partner"},
		"link": "https://new.com",
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/partner", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)
}

func TestDeletePartner_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestPartnerHandler(t)

	createBody := map[string]interface{}{
		"name": map[string]string{"en": "To Delete"},
		"link": "https://delete.com",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/partner", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/partner", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Partners []struct {
				ID string `json:"id"`
			} `json:"partners"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	partnerId := getAllResp.Data.Partners[0].ID

	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/partner/"+partnerId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)
}

