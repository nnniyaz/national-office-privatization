package application

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	applicationService "github.com/nnniyaz/nop/server/service/application"
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
	Phone        string `json:"phone"`
	Email        string `json:"email"`
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
		Phone:        d.GetPhone(),
		Email:        d.GetEmail(),
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

// GetApplications godoc
// @Summary Get all applications
// @Description Retrieves a list of all enterprise applications
// @Tags applications
// @Accept json
// @Produce json
// @Success 200 {object} Applications
// @Failure 500 {object} ErrorResponse
// @Router /api/application [get]
// @Security Bearer
func (hd *HttpDelivery) GetApplications(w http.ResponseWriter, r *http.Request) {
	applications, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewApplications(applications))
}

// GetApplicationById godoc
// @Summary Get application by ID
// @Description Retrieves a single application by ID
// @Tags applications
// @Accept json
// @Produce json
// @Param application_id path string true "Application ID"
// @Success 200 {object} Application
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/application/{application_id} [get]
// @Security Bearer
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
	Phone        string `json:"phone"`
	Email        string `json:"email"`
	Message      string `json:"message"`
}

// CreateApplication godoc
// @Summary Create a new application
// @Description Creates a new enterprise application
// @Tags applications
// @Accept json
// @Produce json
// @Param application body CreateApplicationIn true "Application data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/application [post]
func (hd *HttpDelivery) CreateApplication(w http.ResponseWriter, r *http.Request) {
	var in CreateApplicationIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.EnterpriseId, in.Fio, in.Bin, in.Phone, in.Email, in.Message); err != nil {
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
	Phone        string `json:"phone"`
	Email        string `json:"email"`
	Message      string `json:"message"`
}

// UpdateApplication godoc
// @Summary Update an application
// @Description Updates an existing application
// @Tags applications
// @Accept json
// @Produce json
// @Param application body UpdateApplicationIn true "Application update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/application [put]
// @Security Bearer
func (hd *HttpDelivery) UpdateApplication(w http.ResponseWriter, r *http.Request) {
	var in UpdateApplicationIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.EnterpriseId, in.Fio, in.Bin, in.Phone, in.Email, in.Message); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteApplication godoc
// @Summary Delete an application
// @Description Deletes an application by ID
// @Tags applications
// @Accept json
// @Produce json
// @Param application_id path string true "Application ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/application/{application_id} [delete]
// @Security Bearer
func (hd *HttpDelivery) DeleteApplication(w http.ResponseWriter, r *http.Request) {
	applicationId := chi.URLParam(r, "application_id")
	if err := hd.service.Delete(r.Context(), applicationId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
