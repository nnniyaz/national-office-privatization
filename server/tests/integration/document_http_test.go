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
	"github.com/nnniyaz/nop/server/handler/http/document"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	documentService "github.com/nnniyaz/nop/server/service/document"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// newTestDocumentHandler creates a test HTTP handler without external dependencies
func newTestDocumentHandler(t *testing.T) http.Handler {
	t.Helper()

	// Create mock logger
	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	// Create in-memory repository
	mockRepo := NewMockDocumentRepo()

	// Create service
	svc := documentService.NewDocumentService(l, mockRepo)

	// Create HTTP delivery
	delivery := document.NewHttpDelivery(l, svc)

	// Setup router
	r := chi.NewRouter()

	// Add trace and requestInfo middleware mocks
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx = context.WithValue(ctx, "traceId", "test-trace-id")
			// Mock requestInfo to prevent panic in error handlers
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

	// Register routes (without auth middleware for testing)
	r.Get("/api/document", delivery.GetDocuments)
	r.Get("/api/document/{document_id}", delivery.GetDocumentById)
	r.Post("/api/document", delivery.CreateDocument)
	r.Put("/api/document", delivery.UpdateDocument)
	r.Delete("/api/document/{document_id}", delivery.DeleteDocument)

	return r
}

func TestCreateDocument_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	body := map[string]interface{}{
		"title": map[string]string{
			"kz": "Құжат",
			"ru": "Документ",
			"en": "Document",
		},
		"filename": "doc.pdf",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code, rr.Body.String())

	var resp struct {
		TraceId string      `json:"traceId"`
		Success bool        `json:"success"`
		Data    interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Nil(t, resp.Data)
}

func TestCreateDocument_HTTP_WithString_Rejected(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Old format: simple string instead of MlString object — must be rejected
	body := map[string]interface{}{
		"title":    "Simple Document",
		"filename": "simple.pdf",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusBadRequest, rr.Code, rr.Body.String())

	var resp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.False(t, resp.Success)
}

func TestCreateDocument_HTTP_InvalidTitle_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Empty title (all languages empty)
	body := map[string]interface{}{
		"title": map[string]string{
			"kz": "",
			"ru": "",
			"en": "",
		},
		"filename": "doc.pdf",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)

	var resp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.False(t, resp.Success)
}

func TestCreateDocument_HTTP_EmptyFilename_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	body := map[string]interface{}{
		"title": map[string]string{
			"en": "Document",
		},
		"filename": "",
	}

	bodyBytes, err := json.Marshal(body)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)

	var resp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.False(t, resp.Success)
}

func TestCreateDocument_HTTP_MalformedJSON_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	body := []byte(`{"title": "incomplete json"`)

	req := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusBadRequest, rr.Code)
}

func TestGetDocuments_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Create test document first
	createBody := map[string]interface{}{
		"title":    map[string]string{"en": "Test Document"},
		"filename": "test.pdf",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all documents
	req := httptest.NewRequest(http.MethodGet, "/api/document", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		TraceId string `json:"traceId"`
		Success bool   `json:"success"`
		Data    struct {
			Documents []struct {
				ID       string `json:"id"`
				Filename string `json:"filename"`
				Title    struct {
					EN string `json:"en"`
				} `json:"title"`
			} `json:"documents"`
			Count int `json:"count"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.Documents)
	assert.Equal(t, "test.pdf", resp.Data.Documents[0].Filename)
}

func TestGetDocumentById_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Create test document first
	createBody := map[string]interface{}{
		"title": map[string]string{
			"kz": "Құжат",
			"ru": "Документ",
			"en": "Document",
		},
		"filename": "doc.pdf",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all documents to retrieve ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/document", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Documents []struct {
				ID string `json:"id"`
			} `json:"documents"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	require.NotEmpty(t, getAllResp.Data.Documents)
	documentId := getAllResp.Data.Documents[0].ID

	// Get document by ID
	req := httptest.NewRequest(http.MethodGet, "/api/document/"+documentId, nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			ID       string `json:"id"`
			Filename string `json:"filename"`
			Title    struct {
				KZ string `json:"kz"`
				RU string `json:"ru"`
				EN string `json:"en"`
			} `json:"title"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Equal(t, documentId, resp.Data.ID)
	assert.Equal(t, "doc.pdf", resp.Data.Filename)
	assert.Equal(t, "Document", resp.Data.Title.EN)
}

func TestUpdateDocument_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Create test document first
	createBody := map[string]interface{}{
		"title":    map[string]string{"en": "Old Title"},
		"filename": "old.pdf",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get document ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/document", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Documents []struct {
				ID string `json:"id"`
			} `json:"documents"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	documentId := getAllResp.Data.Documents[0].ID

	// Update document
	updateBody := map[string]interface{}{
		"id": documentId,
		"title": map[string]string{
			"kz": "Жаңа атау",
			"ru": "Новое название",
			"en": "New Title",
		},
		"filename": "new.pdf",
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/document", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	require.Equal(t, http.StatusOK, updateRr.Code)

	var updateResp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(updateRr.Body.Bytes(), &updateResp))
	assert.True(t, updateResp.Success)

	// Verify update
	getReq := httptest.NewRequest(http.MethodGet, "/api/document/"+documentId, nil)
	getRr := httptest.NewRecorder()
	h.ServeHTTP(getRr, getReq)

	var getResp struct {
		Data struct {
			Filename string `json:"filename"`
			Title    struct {
				EN string `json:"en"`
			} `json:"title"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getRr.Body.Bytes(), &getResp))
	assert.Equal(t, "new.pdf", getResp.Data.Filename)
	assert.Equal(t, "New Title", getResp.Data.Title.EN)
}

func TestUpdateDocument_HTTP_EmptyFilename_ShouldFail(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Create test document first
	createBody := map[string]interface{}{
		"title":    map[string]string{"en": "Title"},
		"filename": "file.pdf",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get document ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/document", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Documents []struct {
				ID string `json:"id"`
			} `json:"documents"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	documentId := getAllResp.Data.Documents[0].ID

	// Try to update with empty filename
	updateBody := map[string]interface{}{
		"id":       documentId,
		"title":    map[string]string{"en": "Title"},
		"filename": "",
	}
	updateBodyBytes, _ := json.Marshal(updateBody)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/document", bytes.NewBuffer(updateBodyBytes))
	updateReq.Header.Set("Content-Type", "application/json")
	updateRr := httptest.NewRecorder()

	h.ServeHTTP(updateRr, updateReq)

	assert.Equal(t, http.StatusBadRequest, updateRr.Code)
}

func TestDeleteDocument_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestDocumentHandler(t)

	// Create test document first
	createBody := map[string]interface{}{
		"title":    map[string]string{"en": "To Delete"},
		"filename": "delete.pdf",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/document", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get document ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/document", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Documents []struct {
				ID string `json:"id"`
			} `json:"documents"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	documentId := getAllResp.Data.Documents[0].ID

	// Delete document
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/document/"+documentId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)

	var deleteResp struct {
		Success bool `json:"success"`
	}
	require.NoError(t, json.Unmarshal(deleteRr.Body.Bytes(), &deleteResp))
	assert.True(t, deleteResp.Success)

	// Verify deletion - document should no longer exist
	getReq := httptest.NewRequest(http.MethodGet, "/api/document/"+documentId, nil)
	getRr := httptest.NewRecorder()
	h.ServeHTTP(getRr, getReq)

	// The handler returns 500 with "document not found" error
	// This is expected behavior for deleted documents
	assert.Equal(t, http.StatusInternalServerError, getRr.Code)
}
