package event

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/event/exceptions"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type Event struct {
	id        uuid.UUID
	name      i18n.MlString
	desc      i18n.MlString
	imgUrl    string
	plannedAt time.Time
	createdAt time.Time
	updatedAt time.Time
}

func NewEvent(name, desc i18n.MlString, imgUrl string, plannedAt time.Time) (*Event, error) {
	if err := name.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidEventName
	}
	return &Event{
		id:        uuid.NewUUID(),
		name:      name,
		desc:      desc,
		imgUrl:    imgUrl,
		plannedAt: plannedAt,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (e *Event) GetID() uuid.UUID {
	return e.id
}

func (e *Event) GetName() i18n.MlString {
	return e.name
}

func (e *Event) GetDesc() i18n.MlString {
	return e.desc
}

func (e *Event) GetImgUrl() string {
	return e.imgUrl
}

func (e *Event) GetPlannedAt() time.Time {
	return e.plannedAt
}

func (e *Event) GetCreatedAt() time.Time {
	return e.createdAt
}

func (e *Event) GetUpdatedAt() time.Time {
	return e.updatedAt
}

func (e *Event) Update(name, desc i18n.MlString, imgUrl string, plannedAt time.Time) error {
	if err := name.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidEventName
	}
	e.name = name
	e.desc = desc
	e.imgUrl = imgUrl
	e.plannedAt = plannedAt
	e.updatedAt = time.Now()
	return nil
}

func UnmarshalEventFromDatabase(id uuid.UUID, name, desc i18n.MlString, imgUrl string, plannedAt, createdAt, updatedAt time.Time) *Event {
	return &Event{
		id:        id,
		name:      name,
		desc:      desc,
		imgUrl:    imgUrl,
		plannedAt: plannedAt,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
