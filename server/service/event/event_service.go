package event

import (
	"context"
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/event"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type EventService interface {
	Get(ctx context.Context) ([]*event.Event, error)
	GetById(ctx context.Context, eventId string) (*event.Event, error)
	Create(ctx context.Context, name, desc i18n.MlString, imgUrl string, plannedAt time.Time) error
	Update(ctx context.Context, eventId string, name, desc i18n.MlString, imgUrl string, plannedAt time.Time) error
	Delete(ctx context.Context, eventId string) error
}

type eventService struct {
	logger    logger.Logger
	eventRepo repo.Event
}

func NewEventService(l logger.Logger, repo repo.Event) EventService {
	return &eventService{logger: l, eventRepo: repo}
}

func (s *eventService) Get(ctx context.Context) ([]*event.Event, error) {
	return s.eventRepo.Get(ctx)
}

func (s *eventService) GetById(ctx context.Context, eventId string) (*event.Event, error) {
	convertedId, err := uuid.UUIDFromString(eventId)
	if err != nil {
		return nil, err
	}
	return s.eventRepo.GetById(ctx, convertedId)
}

func (s *eventService) Create(ctx context.Context, name, desc i18n.MlString, imgUrl string, planned time.Time) error {
	e, err := event.NewEvent(name, desc, imgUrl, planned)
	if err != nil {
		return err
	}
	return s.eventRepo.Create(ctx, e)
}

func (s *eventService) Update(ctx context.Context, eventId string, name, desc i18n.MlString, imgUrl string, planned time.Time) error {
	convertedId, err := uuid.UUIDFromString(eventId)
	if err != nil {
		return err
	}
	e, err := s.eventRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	err = e.Update(name, desc, imgUrl, planned)
	if err != nil {
		return err
	}
	return s.eventRepo.Update(ctx, e)
}

func (s *eventService) Delete(ctx context.Context, eventId string) error {
	convertedId, err := uuid.UUIDFromString(eventId)
	if err != nil {
		return err
	}
	return s.eventRepo.Delete(ctx, convertedId)
}
