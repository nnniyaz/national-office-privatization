package application

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/service/application/exceptions"
)

type Application struct {
	id           uuid.UUID
	enterpriseId string
	fio          string
	bin          string
	phone        string
	email        string
	message      string
	createdAt    time.Time
	updatedAt    time.Time
}

func NewApplication(enterpriseId, fio, bin, phone, email, message string) (*Application, error) {
	if enterpriseId == "" {
		return nil, exceptions.ErrInvalidApplicationEnterprise
	}
	if fio == "" {
		return nil, exceptions.ErrInvalidApplicationFio
	}
	if bin == "" {
		return nil, exceptions.ErrInvalidApplicationBin
	}
	if phone == "" {
		return nil, exceptions.ErrInvalidApplicationPhone
	}
	if email == "" {
		return nil, exceptions.ErrInvalidApplicationEmail
	}
	if message == "" {
		return nil, exceptions.ErrInvalidApplicationMessage
	}
	return &Application{
		id:           uuid.NewUUID(),
		enterpriseId: enterpriseId,
		fio:          fio,
		bin:          bin,
		phone:        phone,
		email:        email,
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

func (a *Application) GetPhone() string {
	return a.phone
}

func (a *Application) GetEmail() string {
	return a.email
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

func (a *Application) Update(enterpriseId, fio, bin, phone, email, message string) error {
	if enterpriseId == "" {
		return exceptions.ErrInvalidApplicationEnterprise
	}
	if fio == "" {
		return exceptions.ErrInvalidApplicationFio
	}
	if bin == "" {
		return exceptions.ErrInvalidApplicationBin
	}
	if phone == "" {
		return exceptions.ErrInvalidApplicationPhone
	}
	if email == "" {
		return exceptions.ErrInvalidApplicationEmail
	}
	if message == "" {
		return exceptions.ErrInvalidApplicationMessage
	}

	a.enterpriseId = enterpriseId
	a.fio = fio
	a.bin = bin
	a.phone = phone
	a.email = email
	a.message = message
	a.updatedAt = time.Now()
	return nil
}

func UnmarshalApplicationFromDatabase(id uuid.UUID, enterpriseId, fio, bin, phone, email, message string, createAt, updatedAt time.Time) *Application {
	return &Application{
		id:           id,
		enterpriseId: enterpriseId,
		fio:          fio,
		bin:          bin,
		phone:        phone,
		email:        email,
		message:      message,
		createdAt:    createAt,
		updatedAt:    updatedAt,
	}
}
