package enterprise

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/enterprise"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	enterpriseService "github.com/nnniyaz/nop/server/service/enterprise"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service enterpriseService.EnterpriseService
}

func NewHttpDelivery(l logger.Logger, service enterpriseService.EnterpriseService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Enterprise struct {
	Id              string  `json:"id"`
	Name            string  `json:"name"`
	Location        string  `json:"location"`
	Industry        string  `json:"industry"`
	GovernmentShare float64 `json:"governmentShare"`
	CreatedAt       string  `json:"createdAt"`
	UpdatedAt       string  `json:"updatedAt"`
}

func NewEnterprise(enterprise *enterprise.Enterprise) *Enterprise {
	return &Enterprise{
		Id:              enterprise.GetID().String(),
		Name:            enterprise.GetName(),
		Location:        enterprise.GetLocation(),
		Industry:        enterprise.GetIndustry(),
		GovernmentShare: enterprise.GetGovernmentShare(),
		CreatedAt:       enterprise.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt:       enterprise.GetUpdatedAt().Format(time.RFC3339),
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

func (hd *HttpDelivery) GetEnterprises(w http.ResponseWriter, r *http.Request) {
	offset := r.Context().Value("offset").(int64)
	limit := r.Context().Value("limit").(int64)
	search := r.Context().Value("search").(string)
	foundEnterprises, count, err := hd.service.Get(r.Context(), offset, limit, search)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEnterprises(foundEnterprises, count))
}

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
	Name            string  `json:"name"`
	Location        string  `json:"location"`
	Industry        string  `json:"industry"`
	GovernmentShare float64 `json:"governmentShare"`
}

func (hd *HttpDelivery) CreateEnterprise(w http.ResponseWriter, r *http.Request) {
	in := CreateEnterpriseIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.Name, in.Location, in.Industry, in.GovernmentShare); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateEnterpriseIn struct {
	Id              string  `json:"id"`
	Name            string  `json:"name"`
	Location        string  `json:"location"`
	Industry        string  `json:"industry"`
	GovernmentShare float64 `json:"governmentShare"`
}

func (hd *HttpDelivery) UpdateEnterprise(w http.ResponseWriter, r *http.Request) {
	in := UpdateEnterpriseIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.Name, in.Location, in.Industry, in.GovernmentShare); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteEnterprise(w http.ResponseWriter, r *http.Request) {
	enterpriseId := chi.URLParam(r, "enterprise_id")
	if err := hd.service.Delete(r.Context(), enterpriseId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
