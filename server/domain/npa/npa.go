package npa

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/npa/exceptions"
	"time"
)

type Npa struct {
	id        uuid.UUID
	title     string
	filename  string
	createdAt time.Time
	updatedAt time.Time
}

func NewNpa(title, filename string) (*Npa, error) {
	if title == "" {
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

func (d *Npa) GetTitle() string {
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

func (d *Npa) Update(title, filename string) {
	d.title = title
	d.filename = filename
	d.updatedAt = time.Now()
}

func UnmarshalNpaFromDatabase(id uuid.UUID, title, filename string, createdAt, updatedAt time.Time) *Npa {
	return &Npa{
		id:        id,
		title:     title,
		filename:  filename,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
