package enterprise

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/enterprise"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	enterpriseService "github.com/nnniyaz/nop/server/service/enterprise"
)

type HttpDelivery struct {
	logger  logger.Logger
	service enterpriseService.EnterpriseService
}

func NewHttpDelivery(l logger.Logger, service enterpriseService.EnterpriseService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Enterprise struct {
	Id                       string  `json:"id"`
	Name                     string  `json:"name"`
	Location                 string  `json:"location"`
	Industry                 string  `json:"industry"`
	GovernmentShare          float64 `json:"governmentShare"`
	JuridicalForm            string  `json:"juridicalForm"`
	Year                     int     `json:"year"`
	Owner                    string  `json:"owner"`
	MainActivity             string  `json:"mainActivity"`
	AuthorizedCapital        float64 `json:"authorizedCapital"`
	AuthorizedCapitalComment string  `json:"authorizedCapitalComment"`
	Assets                   float64 `json:"assets"`
	AssetsComment            string  `json:"assetsComment"`
	Equity                   float64 `json:"equity"`
	EquityComment            string  `json:"equityComment"`
	Income                   float64 `json:"income"`
	IncomeComment            string  `json:"incomeComment"`
	NetProfit                float64 `json:"netProfit"`
	NetProfitComment         string  `json:"netProfitComment"`
	NumberOfEmployees        int     `json:"numberOfEmployees"`
	NumberOfEmployeesComment string  `json:"numberOfEmployeesComment"`
	TotalLiabilities         float64 `json:"totalLiabilities"`
	TotalLiabilitiesComment  string  `json:"totalLiabilitiesComment"`
	PropertyComplex          string  `json:"propertyComplex"`
	AdditionalInfo           string  `json:"additionalInfo"`
	SalesRecommendations     string  `json:"salesRecommendations"`
	ImplementationForm       string  `json:"implementationForm"`
	SalePurpose              string  `json:"salePurpose"`
	KeyTerms                 string  `json:"keyTerms"`
	AdditionalTerms          string  `json:"additionalTerms"`
	CreatedAt                string  `json:"createdAt"`
	UpdatedAt                string  `json:"updatedAt"`
}

func NewEnterprise(e *enterprise.Enterprise) *Enterprise {
	return &Enterprise{
		Id:                       e.GetID().String(),
		Name:                     e.GetName(),
		Location:                 e.GetLocation(),
		Industry:                 e.GetIndustry(),
		GovernmentShare:          e.GetGovernmentShare(),
		JuridicalForm:            e.GetJuridicalForm(),
		Year:                     e.GetYear(),
		Owner:                    e.GetOwner(),
		MainActivity:             e.GetMainActivity(),
		AuthorizedCapital:        e.GetAuthorizedCapital(),
		AuthorizedCapitalComment: e.GetAuthorizedCapitalComment(),
		Assets:                   e.GetAssets(),
		AssetsComment:            e.GetAssetsComment(),
		Equity:                   e.GetEquity(),
		EquityComment:            e.GetEquityComment(),
		Income:                   e.GetIncome(),
		IncomeComment:            e.GetIncomeComment(),
		NetProfit:                e.GetNetProfit(),
		NetProfitComment:         e.GetNetProfitComment(),
		NumberOfEmployees:        e.GetNumberOfEmployees(),
		NumberOfEmployeesComment: e.GetNumberOfEmployeesComment(),
		TotalLiabilities:         e.GetTotalLiabilities(),
		TotalLiabilitiesComment:  e.GetTotalLiabilitiesComment(),
		PropertyComplex:          e.GetPropertyComplex(),
		AdditionalInfo:           e.GetAdditionalInfo(),
		SalesRecommendations:     e.GetSalesRecommendations(),
		ImplementationForm:       e.GetImplementationForm(),
		SalePurpose:              e.GetSalePurpose(),
		KeyTerms:                 e.GetKeyTerms(),
		AdditionalTerms:          e.GetAdditionalTerms(),
		CreatedAt:                e.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt:                e.GetUpdatedAt().Format(time.RFC3339),
	}
}

type Enterprises struct {
	Enterprises []*Enterprise `json:"enterprises"`
	Count       int64         `json:"count"`
}

func NewEnterprises(enterprises []*enterprise.Enterprise, count int64) *Enterprises {
	var enterprisesList []*Enterprise
	for _, e := range enterprises {
		enterprisesList = append(enterprisesList, NewEnterprise(e))
	}
	return &Enterprises{
		enterprisesList,
		count,
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

// GetEnterprises godoc
// @Summary Get all enterprises
// @Description Retrieves a paginated list of enterprises with search, region, and field filters
// @Tags enterprises
// @Accept json
// @Produce json
// @Param offset query int false "Offset for pagination" default(0)
// @Param limit query int false "Limit for pagination" default(10)
// @Param search query string false "Search by name"
// @Param region query string false "Filter by region/location"
// @Param field query string false "Filter by industry"
// @Success 200 {object} Enterprises
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [get]
func (hd *HttpDelivery) GetEnterprises(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	search := r.Context().Value("search").(string)
	region := r.Context().Value("region").(string)
	field := r.Context().Value("field").(string)
	foundEnterprises, count, err := hd.service.Get(r.Context(), offset, limit, search, region, field)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEnterprises(foundEnterprises, count))
}

// GetEnterpriseById godoc
// @Summary Get enterprise by ID
// @Description Retrieves a single enterprise with full details
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise_id path string true "Enterprise ID"
// @Success 200 {object} Enterprise
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise/{enterprise_id} [get]
func (hd *HttpDelivery) GetEnterpriseById(w http.ResponseWriter, r *http.Request) {
	enterpriseId := chi.URLParam(r, "enterprise_id")
	foundEnterprise, err := hd.service.GetById(r.Context(), enterpriseId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEnterprise(foundEnterprise))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateEnterpriseIn struct {
	Name                     string  `json:"name"`
	Location                 string  `json:"location"`
	Industry                 string  `json:"industry"`
	GovernmentShare          float64 `json:"governmentShare"`
	JuridicalForm            string  `json:"juridicalForm"`
	Year                     int     `json:"year"`
	Owner                    string  `json:"owner"`
	MainActivity             string  `json:"mainActivity"`
	AuthorizedCapital        float64 `json:"authorizedCapital"`
	AuthorizedCapitalComment string  `json:"authorizedCapitalComment"`
	Assets                   float64 `json:"assets"`
	AssetsComment            string  `json:"assetsComment"`
	Equity                   float64 `json:"equity"`
	EquityComment            string  `json:"equityComment"`
	Income                   float64 `json:"income"`
	IncomeComment            string  `json:"incomeComment"`
	NetProfit                float64 `json:"netProfit"`
	NetProfitComment         string  `json:"netProfitComment"`
	NumberOfEmployees        int     `json:"numberOfEmployees"`
	NumberOfEmployeesComment string  `json:"numberOfEmployeesComment"`
	TotalLiabilities         float64 `json:"totalLiabilities"`
	TotalLiabilitiesComment  string  `json:"totalLiabilitiesComment"`
	PropertyComplex          string  `json:"propertyComplex"`
	AdditionalInfo           string  `json:"additionalInfo"`
	SalesRecommendations     string  `json:"salesRecommendations"`
	ImplementationForm       string  `json:"implementationForm"`
	SalePurpose              string  `json:"salePurpose"`
	KeyTerms                 string  `json:"keyTerms"`
	AdditionalTerms          string  `json:"additionalTerms"`
}

// CreateEnterprise godoc
// @Summary Create a new enterprise
// @Description Creates a new enterprise with complete financial and operational data
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise body CreateEnterpriseIn true "Enterprise data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [post]
// @Security Bearer
func (hd *HttpDelivery) CreateEnterprise(w http.ResponseWriter, r *http.Request) {
	in := CreateEnterpriseIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.Name, in.Location, in.Industry, in.GovernmentShare, in.JuridicalForm, in.Year, in.Owner, in.MainActivity, in.AuthorizedCapital, in.AuthorizedCapitalComment, in.Assets, in.AssetsComment, in.Equity, in.EquityComment, in.Income, in.IncomeComment, in.NetProfit, in.NetProfitComment, in.NumberOfEmployees, in.NumberOfEmployeesComment, in.TotalLiabilities, in.TotalLiabilitiesComment, in.PropertyComplex, in.AdditionalInfo, in.SalesRecommendations, in.ImplementationForm, in.SalePurpose, in.KeyTerms, in.AdditionalTerms); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateEnterpriseIn struct {
	Id                       string  `json:"id"`
	Name                     string  `json:"name"`
	Location                 string  `json:"location"`
	Industry                 string  `json:"industry"`
	GovernmentShare          float64 `json:"governmentShare"`
	JuridicalForm            string  `json:"juridicalForm"`
	Year                     int     `json:"year"`
	Owner                    string  `json:"owner"`
	MainActivity             string  `json:"mainActivity"`
	AuthorizedCapital        float64 `json:"authorizedCapital"`
	AuthorizedCapitalComment string  `json:"authorizedCapitalComment"`
	Assets                   float64 `json:"assets"`
	AssetsComment            string  `json:"assetsComment"`
	Equity                   float64 `json:"equity"`
	EquityComment            string  `json:"equityComment"`
	Income                   float64 `json:"income"`
	IncomeComment            string  `json:"incomeComment"`
	NetProfit                float64 `json:"netProfit"`
	NetProfitComment         string  `json:"netProfitComment"`
	NumberOfEmployees        int     `json:"numberOfEmployees"`
	NumberOfEmployeesComment string  `json:"numberOfEmployeesComment"`
	TotalLiabilities         float64 `json:"totalLiabilities"`
	TotalLiabilitiesComment  string  `json:"totalLiabilitiesComment"`
	PropertyComplex          string  `json:"propertyComplex"`
	AdditionalInfo           string  `json:"additionalInfo"`
	SalesRecommendations     string  `json:"salesRecommendations"`
	ImplementationForm       string  `json:"implementationForm"`
	SalePurpose              string  `json:"salePurpose"`
	KeyTerms                 string  `json:"keyTerms"`
	AdditionalTerms          string  `json:"additionalTerms"`
}

// UpdateEnterprise godoc
// @Summary Update an enterprise
// @Description Updates an existing enterprise with new data
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise body UpdateEnterpriseIn true "Enterprise update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [put]
// @Security Bearer
func (hd *HttpDelivery) UpdateEnterprise(w http.ResponseWriter, r *http.Request) {
	in := UpdateEnterpriseIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.Name, in.Location, in.Industry, in.GovernmentShare, in.JuridicalForm, in.Year, in.Owner, in.MainActivity, in.AuthorizedCapital, in.AuthorizedCapitalComment, in.Assets, in.AssetsComment, in.Equity, in.EquityComment, in.Income, in.IncomeComment, in.NetProfit, in.NetProfitComment, in.NumberOfEmployees, in.NumberOfEmployeesComment, in.TotalLiabilities, in.TotalLiabilitiesComment, in.PropertyComplex, in.AdditionalInfo, in.SalesRecommendations, in.ImplementationForm, in.SalePurpose, in.KeyTerms, in.AdditionalTerms); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteEnterprise godoc
// @Summary Delete an enterprise
// @Description Deletes an enterprise by ID
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise_id path string true "Enterprise ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise/{enterprise_id} [delete]
// @Security Bearer
func (hd *HttpDelivery) DeleteEnterprise(w http.ResponseWriter, r *http.Request) {
	enterpriseId := chi.URLParam(r, "enterprise_id")
	if err := hd.service.Delete(r.Context(), enterpriseId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
