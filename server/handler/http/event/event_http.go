package event

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/domain/event"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	eventService "github.com/nnniyaz/nop/service/event"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service eventService.EventService
}

func NewHttpDelivery(l logger.Logger, service eventService.EventService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Event struct {
	Id        string `json:"id"`
	Name      string `json:"name"`
	Desc      string `json:"desc"`
	ImgUrl    string `json:"imgUrl"`
	PlannedAt string `json:"plannedAt"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
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

func (hd *HttpDelivery) GetEvents(w http.ResponseWriter, r *http.Request) {
	events, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEvents(events))
}

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
	Name      string    `json:"name"`
	Desc      string    `json:"desc"`
	ImgUrl    string    `json:"imgUrl"`
	PlannedAt time.Time `json:"plannedAt"`
}

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
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	Desc      string    `json:"desc"`
	ImgUrl    string    `json:"imgUrl"`
	PlannedAt time.Time `json:"plannedAt"`
}

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

func (hd *HttpDelivery) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	eventId := chi.URLParam(r, "event_id")
	if err := hd.service.Delete(r.Context(), eventId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
