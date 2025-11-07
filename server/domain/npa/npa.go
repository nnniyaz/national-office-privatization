package npa

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/npa/exceptions"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type Npa struct {
	id        uuid.UUID
	title     i18n.MlString
	filename  string
	createdAt time.Time
	updatedAt time.Time
}

func NewNpa(title i18n.MlString, filename string) (*Npa, error) {
	if err := title.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidNpaLabel
	}
	if filename == "" {
		return nil, exceptions.ErrInvalidNpaFilename
	}
	return &Npa{
		id:        uuid.NewUUID(),
		title:     title,
		filename:  filename,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (d *Npa) GetID() uuid.UUID {
	return d.id
}

func (d *Npa) GetTitle() i18n.MlString {
	return d.title
}

func (d *Npa) GetFilename() string {
	return d.filename
}

func (d *Npa) GetCreatedAt() time.Time {
	return d.createdAt
}

func (d *Npa) GetUpdatedAt() time.Time {
	return d.updatedAt
}

func (d *Npa) Update(title i18n.MlString, filename string) error {
	if err := title.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidNpaLabel
	}
	d.title = title
	d.filename = filename
	d.updatedAt = time.Now()
	return nil
}

func UnmarshalNpaFromDatabase(id uuid.UUID, title i18n.MlString, filename string, createdAt, updatedAt time.Time) *Npa {
	return &Npa{
		id:        id,
		title:     title,
		filename:  filename,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
