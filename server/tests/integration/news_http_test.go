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
	"github.com/nnniyaz/nop/server/handler/http/news"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	newsService "github.com/nnniyaz/nop/server/service/news"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestNewsHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockNewsRepo()
	svc := newsService.NewNewsService(l, mockRepo)
	delivery := news.NewHttpDelivery(l, svc)

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

	r.Get("/api/news", delivery.GetNews)
	r.Get("/api/news/{news_id}", delivery.GetNewsById)
	r.Post("/api/news", delivery.CreateNews)
	r.Put("/api/news", delivery.UpdateNews)
	r.Delete("/api/news/{news_id}", delivery.DeleteNews)

	return r
}

func TestCreateNews_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	body := map[string]interface{}{
		"title": map[string]string{
			"kz": "Жаңалық",
			"ru": "Новость",
			"en": "News",
		},
		"content": map[string]string{
			"kz": "Мазмұн",
			"ru": "Содержание",
			"en": "Content",
		},
		"imgUrl": "news.jpg",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code, rr.Body.String())

	var resp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
}

func TestCreateNews_HTTP_InvalidTitle_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	body := map[string]interface{}{
		"title": map[string]string{},
		"content": map[string]string{
			"en": "Content",
		},
		"imgUrl": "news.jpg",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestCreateNews_HTTP_InvalidContent_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	body := map[string]interface{}{
		"title": map[string]string{
			"en": "Title",
		},
		"content": map[string]string{},
		"imgUrl":  "news.jpg",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestGetNews_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	// Create test news first
	createBody := map[string]interface{}{
		"title":   map[string]string{"en": "Test News"},
		"content": map[string]string{"en": "Test Content"},
		"imgUrl":  "test.jpg",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all news
	req := httptest.NewRequest(http.MethodGet, "/api/news", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			News  []interface{} `json:"news"`
			Count int           `json:"count"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.News)
}

func TestGetNewsById_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	// Create test news
	createBody := map[string]interface{}{
		"title": map[string]string{
			"kz": "Жаңалық",
			"ru": "Новость",
			"en": "News",
		},
		"content": map[string]string{
			"en": "Content",
		},
		"imgUrl": "news.jpg",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all news to retrieve ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/news", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			News []struct {
				ID string `json:"id"`
			} `json:"news"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	require.NotEmpty(t, getAllResp.Data.News)
	newsId := getAllResp.Data.News[0].ID

	// Get news by ID
	req := httptest.NewRequest(http.MethodGet, "/api/news/"+newsId, nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			ID    string `json:"id"`
			Title struct {
				EN string `json:"en"`
			} `json:"title"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Equal(t, newsId, resp.Data.ID)
}

func TestUpdateNews_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	// Create test news
	createBody := map[string]interface{}{
		"title":   map[string]string{"en": "Old Title"},
		"content": map[string]string{"en": "Old Content"},
		"imgUrl":  "old.jpg",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get news ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/news", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			News []struct {
				ID string `json:"id"`
			} `json:"news"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	newsId := getAllResp.Data.News[0].ID

	// Update news
	updateBody := map[string]interface{}{
		"id": newsId,
		"title": map[string]string{
			"en": "New Title",
		},
		"content": map[string]string{
			"en": "New Content",
		},
		"imgUrl": "new.jpg",
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/news", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)

	var updateResp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(updateRr.Body.Bytes(), &updateResp))
	assert.True(t, updateResp.Success)
}

func TestDeleteNews_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestNewsHandler(t)

	// Create test news
	createBody := map[string]interface{}{
		"title":   map[string]string{"en": "To Delete"},
		"content": map[string]string{"en": "Content"},
		"imgUrl":  "delete.jpg",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/news", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get news ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/news", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			News []struct {
				ID string `json:"id"`
			} `json:"news"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	newsId := getAllResp.Data.News[0].ID

	// Delete news
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/news/"+newsId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)

	var deleteResp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(deleteRr.Body.Bytes(), &deleteResp))
	assert.True(t, deleteResp.Success)

	// Verify deletion
	getReq := httptest.NewRequest(http.MethodGet, "/api/news/"+newsId, nil)
	getRr := httptest.NewRecorder()
	h.ServeHTTP(getRr, getReq)

	assert.Equal(t, http.StatusInternalServerError, getRr.Code)
}

