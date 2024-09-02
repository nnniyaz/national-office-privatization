package application

import (
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/service/application/exceptions"
	"time"
)

type Application struct {
	id           uuid.UUID
	enterpriseId string
	fio          string
	bin          string
	contact      string
	message      string
	createdAt    time.Time
	updatedAt    time.Time
}

func NewApplication(enterpriseId, fio, bin, contact, message string) (*Application, error) {
	if enterpriseId == "" {
		return nil, exceptions.ErrInvalidApplicationEnterprise
	}
	if fio == "" {
		return nil, exceptions.ErrInvalidApplicationFio
	}
	if bin == "" {
		return nil, exceptions.ErrInvalidApplicationBin
	}
	if contact == "" {
		return nil, exceptions.ErrInvalidApplicationContact
	}
	if message == "" {
		return nil, exceptions.ErrInvalidApplicationMessage
	}
	return &Application{
		id:           uuid.NewUUID(),
		enterpriseId: enterpriseId,
		fio:          fio,
		bin:          bin,
		contact:      contact,
		message:      message,
		createdAt:    time.Now(),
		updatedAt:    time.Now(),
	}, nil
}

func (a *Application) GetID() uuid.UUID {
	return a.id
}

func (a *Application) GetEnterpriseId() string {
	return a.enterpriseId
}

func (a *Application) GetFio() string {
	return a.fio
}

func (a *Application) GetBin() string {
	return a.bin
}

func (a *Application) GetContact() string {
	return a.contact
}

func (a *Application) GetMessage() string {
	return a.message
}

func (a *Application) GetCreatedAt() time.Time {
	return a.createdAt
}

func (a *Application) GetUpdatedAt() time.Time {
	return a.updatedAt
}

func (a *Application) Update(enterpriseId, fio, bin, contact, message string) error {
	if enterpriseId == "" {
		return exceptions.ErrInvalidApplicationEnterprise
	}
	if fio == "" {
		return exceptions.ErrInvalidApplicationFio
	}
	if bin == "" {
		return exceptions.ErrInvalidApplicationBin
	}
	if contact == "" {
		return exceptions.ErrInvalidApplicationContact
	}
	if message == "" {
		return exceptions.ErrInvalidApplicationMessage
	}

	a.enterpriseId = enterpriseId
	a.fio = fio
	a.bin = bin
	a.contact = contact
	a.message = message
	a.updatedAt = time.Now()
	return nil
}

func UnmarshalApplicationFromDatabase(id uuid.UUID, enterpriseId, fio, bin, contact, message string, createAt time.Time) *Application {
	return &Application{
		id:           id,
		enterpriseId: enterpriseId,
		fio:          fio,
		bin:          bin,
		contact:      contact,
		message:      message,
		createdAt:    createAt,
		updatedAt:    time.Now(),
	}
}
