package application

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/domain/application"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	applicationService "github.com/nnniyaz/nop/service/application"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service applicationService.ApplicationService
}

func NewHttpDelivery(l logger.Logger, service applicationService.ApplicationService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Application struct {
	Id           string `json:"id"`
	EnterpriseId string `json:"enterpriseId"`
	Fio          string `json:"fio"`
	Bin          string `json:"bin"`
	Contact      string `json:"contact"`
	Message      string `json:"message"`
	CreatedAt    string `json:"createdAt"`
	UpdatedAt    string `json:"updatedAt"`
}

func NewApplication(d *application.Application) *Application {
	return &Application{
		Id:           d.GetID().String(),
		EnterpriseId: d.GetEnterpriseId(),
		Fio:          d.GetFio(),
		Bin:          d.GetBin(),
		Contact:      d.GetContact(),
		Message:      d.GetMessage(),
		CreatedAt:    d.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt:    d.GetUpdatedAt().Format(time.RFC3339),
	}
}

type Applications struct {
	Applications []*Application `json:"applications"`
	Count        int            `json:"count"`
}

func NewApplications(applications []*application.Application) *Applications {
	var applicationsList []*Application
	for _, d := range applications {
		applicationsList = append(applicationsList, NewApplication(d))
	}
	return &Applications{
		applicationsList,
		len(applicationsList),
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) GetApplications(w http.ResponseWriter, r *http.Request) {
	applications, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewApplications(applications))
}

func (hd *HttpDelivery) GetApplicationById(w http.ResponseWriter, r *http.Request) {
	applicationId := chi.URLParam(r, "application_id")
	application, err := hd.service.GetById(r.Context(), applicationId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewApplication(application))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateApplicationIn struct {
	EnterpriseId string `json:"enterpriseId"`
	Fio          string `json:"fio"`
	Bin          string `json:"bin"`
	Contact      string `json:"contact"`
	Message      string `json:"message"`
}

func (hd *HttpDelivery) CreateApplication(w http.ResponseWriter, r *http.Request) {
	var in CreateApplicationIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.EnterpriseId, in.Fio, in.Bin, in.Contact, in.Message); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateApplicationIn struct {
	Id           string `json:"id"`
	EnterpriseId string `json:"enterpriseId"`
	Fio          string `json:"fio"`
	Bin          string `json:"bin"`
	Contact      string `json:"contact"`
	Message      string `json:"message"`
}

func (hd *HttpDelivery) UpdateApplication(w http.ResponseWriter, r *http.Request) {
	var in UpdateApplicationIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.EnterpriseId, in.Fio, in.Bin, in.Contact, in.Message); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteApplication(w http.ResponseWriter, r *http.Request) {
	applicationId := chi.URLParam(r, "application_id")
	if err := hd.service.Delete(r.Context(), applicationId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
