package document

import (
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/document/exceptions"
	"time"
)

type Document struct {
	id        uuid.UUID
	title     string
	filename  string
	createdAt time.Time
	updatedAt time.Time
}

func NewDocument(title, filename string) (*Document, error) {
	if title == "" {
		return nil, exceptions.ErrInvalidDocumentLabel
	}
	if filename == "" {
		return nil, exceptions.ErrInvalidDocumentFilename
	}
	return &Document{
		id:       uuid.NewUUID(),
		title:    title,
		filename: filename,
	}, nil
}

func (d *Document) GetID() uuid.UUID {
	return d.id
}

func (d *Document) GetTitle() string {
	return d.title
}

func (d *Document) GetFilename() string {
	return d.filename
}

func (d *Document) GetCreatedAt() time.Time {
	return d.createdAt
}

func (d *Document) GetUpdatedAt() time.Time {
	return d.updatedAt
}

func (d *Document) Update(title, filename string) {
	d.title = title
	d.filename = filename
	d.updatedAt = time.Now()
}

func UnmarshalDocumentFromDatabase(id uuid.UUID, title, filename string, createdAt, updatedAt time.Time) *Document {
	return &Document{
		id:        id,
		title:     title,
		filename:  filename,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
