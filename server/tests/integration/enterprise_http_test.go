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
	"github.com/nnniyaz/nop/server/handler/http/enterprise"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	enterpriseService "github.com/nnniyaz/nop/server/service/enterprise"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestEnterpriseHandler(t *testing.T) http.Handler {
	t.Helper()

	l, err := logger.NewLogger(false)
	require.NoError(t, err)

	mockRepo := NewMockEnterpriseRepo()
	svc := enterpriseService.NewEnterpriseService(l, mockRepo)
	delivery := enterprise.NewHttpDelivery(l, svc)

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
			// Add pagination and filter params for GET /api/enterprise
			ctx = context.WithValue(ctx, "offset", int64(0))
			ctx = context.WithValue(ctx, "limit", int64(10))
			ctx = context.WithValue(ctx, "search", "")
			ctx = context.WithValue(ctx, "region", "")
			ctx = context.WithValue(ctx, "field", "")
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})

	r.Get("/api/enterprise", delivery.GetEnterprises)
	r.Get("/api/enterprise/{enterprise_id}", delivery.GetEnterpriseById)
	r.Post("/api/enterprise", delivery.CreateEnterprise)
	r.Put("/api/enterprise", delivery.UpdateEnterprise)
	r.Delete("/api/enterprise/{enterprise_id}", delivery.DeleteEnterprise)

	return r
}

func TestCreateEnterprise_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEnterpriseHandler(t)

	body := map[string]interface{}{
		"name":                     "Test Enterprise LLC",
		"location":                 "Almaty",
		"industry":                 "IT",
		"governmentShare":          25.5,
		"juridicalForm":            "LLP",
		"year":                     2020,
		"owner":                    "John Doe",
		"mainActivity":             "Software Development",
		"authorizedCapital":        1000000.0,
		"authorizedCapitalComment": "Paid in full",
		"assets":                   5000000.0,
		"assetsComment":            "Including real estate",
		"equity":                   3000000.0,
		"equityComment":            "Strong equity position",
		"income":                   10000000.0,
		"incomeComment":            "Annual revenue",
		"netProfit":                2000000.0,
		"netProfitComment":         "After tax",
		"numberOfEmployees":        50,
		"numberOfEmployeesComment": "Full-time staff",
		"totalLiabilities":         2000000.0,
		"totalLiabilitiesComment":  "Short and long term debt",
		"propertyComplex":          "Office building",
		"additionalInfo":           "Growing company",
		"salesRecommendations":     "Direct sale",
		"implementationForm":       "Asset sale",
		"salePurpose":              "Strategic acquisition",
		"keyTerms":                 "Cash payment",
		"additionalTerms":          "Non-compete agreement",
	}

	bodyBytes, _ := json.Marshal(body)
	req := httptest.NewRequest(http.MethodPost, "/api/enterprise", bytes.NewBuffer(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code, rr.Body.String())
}

func TestGetEnterprises_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEnterpriseHandler(t)

	// Create enterprise first
	createBody := map[string]interface{}{
		"name":                     "Enterprise 1",
		"location":                 "Astana",
		"industry":                 "Manufacturing",
		"governmentShare":          50.0,
		"juridicalForm":            "JSC",
		"year":                     2015,
		"owner":                    "State",
		"mainActivity":             "Production",
		"authorizedCapital":        1000000.0,
		"authorizedCapitalComment": "",
		"assets":                   5000000.0,
		"assetsComment":            "",
		"equity":                   3000000.0,
		"equityComment":            "",
		"income":                   10000000.0,
		"incomeComment":            "",
		"netProfit":                1000000.0,
		"netProfitComment":         "",
		"numberOfEmployees":        100,
		"numberOfEmployeesComment": "",
		"totalLiabilities":         2000000.0,
		"totalLiabilitiesComment":  "",
		"propertyComplex":          "",
		"additionalInfo":           "",
		"salesRecommendations":     "",
		"implementationForm":       "",
		"salePurpose":              "",
		"keyTerms":                 "",
		"additionalTerms":          "",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/enterprise", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all enterprises
	req := httptest.NewRequest(http.MethodGet, "/api/enterprise", nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Enterprises []interface{} `json:"enterprises"`
			Count       int           `json:"count"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.NotEmpty(t, resp.Data.Enterprises)
}

func TestGetEnterpriseById_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEnterpriseHandler(t)

	// Create enterprise first (minimal data)
	createBody := map[string]interface{}{
		"name":                     "Test Corp",
		"location":                 "Almaty",
		"industry":                 "IT",
		"governmentShare":          0.0,
		"juridicalForm":            "LLP",
		"year":                     2021,
		"owner":                    "Private",
		"mainActivity":             "Services",
		"authorizedCapital":        100000.0,
		"authorizedCapitalComment": "",
		"assets":                   500000.0,
		"assetsComment":            "",
		"equity":                   300000.0,
		"equityComment":            "",
		"income":                   1000000.0,
		"incomeComment":            "",
		"netProfit":                100000.0,
		"netProfitComment":         "",
		"numberOfEmployees":        10,
		"numberOfEmployeesComment": "",
		"totalLiabilities":         200000.0,
		"totalLiabilitiesComment":  "",
		"propertyComplex":          "",
		"additionalInfo":           "",
		"salesRecommendations":     "",
		"implementationForm":       "",
		"salePurpose":              "",
		"keyTerms":                 "",
		"additionalTerms":          "",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/enterprise", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get all to retrieve ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/enterprise", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Enterprises []struct {
				ID string `json:"id"`
			} `json:"enterprises"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	require.NotEmpty(t, getAllResp.Data.Enterprises)
	enterpriseId := getAllResp.Data.Enterprises[0].ID

	// Get by ID
	req := httptest.NewRequest(http.MethodGet, "/api/enterprise/"+enterpriseId, nil)
	rr := httptest.NewRecorder()

	h.ServeHTTP(rr, req)

	require.Equal(t, http.StatusOK, rr.Code)

	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(rr.Body.Bytes(), &resp))
	assert.True(t, resp.Success)
	assert.Equal(t, enterpriseId, resp.Data.ID)
	assert.Equal(t, "Test Corp", resp.Data.Name)
}

func TestDeleteEnterprise_HTTP(t *testing.T) {
	t.Parallel()

	h := newTestEnterpriseHandler(t)

	// Create enterprise first
	createBody := map[string]interface{}{
		"name":                     "To Delete",
		"location":                 "Shymkent",
		"industry":                 "Trade",
		"governmentShare":          0.0,
		"juridicalForm":            "IE",
		"year":                     2022,
		"owner":                    "Individual",
		"mainActivity":             "Retail",
		"authorizedCapital":        50000.0,
		"authorizedCapitalComment": "",
		"assets":                   100000.0,
		"assetsComment":            "",
		"equity":                   80000.0,
		"equityComment":            "",
		"income":                   500000.0,
		"incomeComment":            "",
		"netProfit":                50000.0,
		"netProfitComment":         "",
		"numberOfEmployees":        5,
		"numberOfEmployeesComment": "",
		"totalLiabilities":         20000.0,
		"totalLiabilitiesComment":  "",
		"propertyComplex":          "",
		"additionalInfo":           "",
		"salesRecommendations":     "",
		"implementationForm":       "",
		"salePurpose":              "",
		"keyTerms":                 "",
		"additionalTerms":          "",
	}
	createBodyBytes, _ := json.Marshal(createBody)
	createReq := httptest.NewRequest(http.MethodPost, "/api/enterprise", bytes.NewBuffer(createBodyBytes))
	createReq.Header.Set("Content-Type", "application/json")
	createRr := httptest.NewRecorder()
	h.ServeHTTP(createRr, createReq)

	// Get ID
	getAllReq := httptest.NewRequest(http.MethodGet, "/api/enterprise", nil)
	getAllRr := httptest.NewRecorder()
	h.ServeHTTP(getAllRr, getAllReq)

	var getAllResp struct {
		Data struct {
			Enterprises []struct {
				ID string `json:"id"`
			} `json:"enterprises"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(getAllRr.Body.Bytes(), &getAllResp))
	enterpriseId := getAllResp.Data.Enterprises[0].ID

	// Delete
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/enterprise/"+enterpriseId, nil)
	deleteRr := httptest.NewRecorder()

	h.ServeHTTP(deleteRr, deleteReq)

	require.Equal(t, http.StatusOK, deleteRr.Code)
}

