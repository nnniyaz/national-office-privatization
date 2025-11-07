package event

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/event"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	eventService "github.com/nnniyaz/nop/server/service/event"
)

type HttpDelivery struct {
	logger  logger.Logger
	service eventService.EventService
}

func NewHttpDelivery(l logger.Logger, service eventService.EventService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Event struct {
	Id        string        `json:"id"`
	Name      i18n.MlString `json:"name"`
	Desc      i18n.MlString `json:"desc"`
	ImgUrl    string        `json:"imgUrl"`
	PlannedAt string        `json:"plannedAt"`
	CreatedAt string        `json:"createdAt"`
	UpdatedAt string        `json:"updatedAt"`
}

func NewEvent(event *event.Event) *Event {
	return &Event{
		Id:        event.GetID().String(),
		Name:      event.GetName(),
		Desc:      event.GetDesc(),
		ImgUrl:    event.GetImgUrl(),
		PlannedAt: event.GetPlannedAt().Format(time.RFC3339),
		CreatedAt: event.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt: event.GetUpdatedAt().Format(time.RFC3339),
	}
}

type Events struct {
	Events []*Event `json:"events"`
	Count  int      `json:"count"`
}

func NewEvents(events []*event.Event) *Events {
	var eventsList []*Event
	for _, e := range events {
		eventsList = append(eventsList, NewEvent(e))
	}
	return &Events{
		eventsList,
		len(eventsList),
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

// GetEvents godoc
// @Summary Get all events
// @Description Retrieves a list of all events with multilingual support
// @Tags events
// @Accept json
// @Produce json
// @Success 200 {object} Events
// @Failure 500 {object} ErrorResponse
// @Router /api/event [get]
// @Security Bearer
func (hd *HttpDelivery) GetEvents(w http.ResponseWriter, r *http.Request) {
	events, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEvents(events))
}

// GetEventById godoc
// @Summary Get event by ID
// @Description Retrieves a single event by its ID
// @Tags events
// @Accept json
// @Produce json
// @Param event_id path string true "Event ID"
// @Success 200 {object} Event
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/event/{event_id} [get]
// @Security Bearer
func (hd *HttpDelivery) GetEventById(w http.ResponseWriter, r *http.Request) {
	eventId := chi.URLParam(r, "event_id")
	event, err := hd.service.GetById(r.Context(), eventId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEvent(event))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateEventIn struct {
	Name      i18n.MlString `json:"name"`
	Desc      i18n.MlString `json:"desc"`
	ImgUrl    string        `json:"imgUrl"`
	PlannedAt time.Time     `json:"plannedAt"`
}

// CreateEvent godoc
// @Summary Create a new event
// @Description Creates a new event with multilingual name and description
// @Tags events
// @Accept json
// @Produce json
// @Param event body CreateEventIn true "Event data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/event [post]
// @Security Bearer
func (hd *HttpDelivery) CreateEvent(w http.ResponseWriter, r *http.Request) {
	var in CreateEventIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Create(r.Context(), in.Name, in.Desc, in.ImgUrl, in.PlannedAt); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateEventIn struct {
	Id        string        `json:"id"`
	Name      i18n.MlString `json:"name"`
	Desc      i18n.MlString `json:"desc"`
	ImgUrl    string        `json:"imgUrl"`
	PlannedAt time.Time     `json:"plannedAt"`
}

// UpdateEvent godoc
// @Summary Update an event
// @Description Updates an existing event with new data
// @Tags events
// @Accept json
// @Produce json
// @Param event body UpdateEventIn true "Event update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/event [put]
// @Security Bearer
func (hd *HttpDelivery) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	var in UpdateEventIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Update(r.Context(), in.Id, in.Name, in.Desc, in.ImgUrl, in.PlannedAt); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteEvent godoc
// @Summary Delete an event
// @Description Deletes an event by ID
// @Tags events
// @Accept json
// @Produce json
// @Param event_id path string true "Event ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/event/{event_id} [delete]
// @Security Bearer
func (hd *HttpDelivery) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	eventId := chi.URLParam(r, "event_id")
	if err := hd.service.Delete(r.Context(), eventId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
