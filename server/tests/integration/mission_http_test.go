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
	"github.com/nnniyaz/nop/server/handler/http/mission"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	missionService "github.com/nnniyaz/nop/server/service/mission"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestMissionHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockMissionRepo()
	svc := missionService.NewMissionService(l, mockRepo)
	delivery := mission.NewHttpDelivery(l, svc)

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

	r.Get("/api/mission", delivery.GetMission)
	r.Post("/api/mission", delivery.CreateMission)
	r.Put("/api/mission", delivery.UpdateMission)

	return r
}

func TestCreateMission_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestMissionHandler(t)

	body := map[string]interface{}{
		"text": map[string]string{"en": "Our mission is to serve the people"},
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/mission", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)
}

func TestGetMission_HTTP_Empty(t *testing.T) {
	t.Parallel()

	h := newTestMissionHandler(t)

	// Get mission when it doesn't exist yet
	req := httptest.NewRequest(http.MethodGet, "/api/mission", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Nil(t, resp.Data) // Should be null when mission doesn't exist
}

func TestGetMission_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestMissionHandler(t)

	// Create mission first
	createBody := map[string]interface{}{
		"text": map[string]string{"en": "Mission text"},
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/mission", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get mission
	req := httptest.NewRequest(http.MethodGet, "/api/mission", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Text map[string]string `json:"text"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Equal(t, "Mission text", resp.Data.Text["en"])
}

func TestUpdateMission_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestMissionHandler(t)

	// Create mission first
	createBody := map[string]interface{}{
		"text": map[string]string{"en": "Old mission"},
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/mission", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Update mission
	updateBody := map[string]interface{}{
		"text": map[string]string{"en": "New mission"},
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/mission", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)

	// Verify update
	getReq := httptest.NewRequest(http.MethodGet, "/api/mission", nil)
	getRr := httptest.NewRecorder()
	h.ServeHTTP(getRr, getReq)

	var getResp struct {
		Data struct {
			Text map[string]string `json:"text"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getRr.Body.Bytes(), &getResp))
	assert.Equal(t, "New mission", getResp.Data.Text["en"])
}

