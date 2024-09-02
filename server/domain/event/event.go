package event

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/event/exceptions"
	"time"
)

type Event struct {
	id        uuid.UUID
	name      string
	desc      string
	imgUrl    string
	plannedAt time.Time
	createdAt time.Time
	updatedAt time.Time
}

func NewEvent(name, desc, imgUrl string, plannedAt time.Time) (*Event, error) {
	if name == "" {
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

func (e *Event) GetName() string {
	return e.name
}

func (e *Event) GetDesc() string {
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

func (e *Event) Update(name, desc, imgUrl string, plannedAt time.Time) error {
	if name == "" {
		return exceptions.ErrInvalidEventName
	}
	e.name = name
	e.desc = desc
	e.imgUrl = imgUrl
	e.plannedAt = plannedAt
	e.updatedAt = time.Now()
	return nil
}

func UnmarshalEventFromDatabase(id uuid.UUID, name, desc, imgUrl string, plannedAt, createdAt, updatedAt time.Time) *Event {
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
