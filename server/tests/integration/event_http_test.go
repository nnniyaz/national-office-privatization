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
	"github.com/nnniyaz/nop/server/handler/http/event"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	eventService "github.com/nnniyaz/nop/server/service/event"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestEventHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockEventRepo()
	svc := eventService.NewEventService(l, mockRepo)
	delivery := event.NewHttpDelivery(l, svc)

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

	r.Get("/api/event", delivery.GetEvents)
	r.Get("/api/event/{event_id}", delivery.GetEventById)
	r.Post("/api/event", delivery.CreateEvent)
	r.Put("/api/event", delivery.UpdateEvent)
	r.Delete("/api/event/{event_id}", delivery.DeleteEvent)

	return r
}

func TestCreateEvent_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEventHandler(t)

	body := map[string]interface{}{
		"name": map[string]string{"en": "Test Event"},
		"desc": map[string]string{"en": "Test Description"},
		"imgUrl":    "event.jpg",
		"plannedAt": time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)
}

func TestGetEvents_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEventHandler(t)

	createBody := map[string]interface{}{
		"name":      map[string]string{"en": "Event"},
		"desc":      map[string]string{"en": "Description"},
		"imgUrl":    "event.jpg",
		"plannedAt": time.Now().Format(time.RFC3339),
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	req := httptest.NewRequest(http.MethodGet, "/api/event", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Events []interface{} `json:"events"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.Events)
}

func TestUpdateEvent_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEventHandler(t)

	createBody := map[string]interface{}{
		"name":      map[string]string{"en": "Old Event"},
		"desc":      map[string]string{"en": "Old Description"},
		"imgUrl":    "old.jpg",
		"plannedAt": time.Now().Format(time.RFC3339),
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/event", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Events []struct {
				ID string `json:"id"`
			} `json:"events"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	eventId := getAllResp.Data.Events[0].ID

	updateBody := map[string]interface{}{
		"id":        eventId,
		"name":      map[string]string{"en": "New Event"},
		"desc":      map[string]string{"en": "New Description"},
		"imgUrl":    "new.jpg",
		"plannedAt": time.Now().Format(time.RFC3339),
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/event", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)
}

func TestDeleteEvent_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEventHandler(t)

	createBody := map[string]interface{}{
		"name":      map[string]string{"en": "To Delete"},
		"desc":      map[string]string{"en": "Description"},
		"imgUrl":    "delete.jpg",
		"plannedAt": time.Now().Format(time.RFC3339),
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/event", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	getAllReq := httptest.NewRequest(http.MethodGet, "/api/event", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Events []struct {
				ID string `json:"id"`
			} `json:"events"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	eventId := getAllResp.Data.Events[0].ID

	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/event/"+eventId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)
}

