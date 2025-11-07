package document

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/document/exceptions"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type Document struct {
	id        uuid.UUID
	title     i18n.MlString
	filename  string
	createdAt time.Time
	updatedAt time.Time
}

func NewDocument(title i18n.MlString, filename string) (*Document, error) {
	if err := title.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidDocumentLabel
	}
	if filename == "" {
		return nil, exceptions.ErrInvalidDocumentFilename
	}
	return &Document{
		id:        uuid.NewUUID(),
		title:     title,
		filename:  filename,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (d *Document) GetID() uuid.UUID {
	return d.id
}

func (d *Document) GetTitle() i18n.MlString {
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

func (d *Document) Update(title i18n.MlString, filename string) error {
	if err := title.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidDocumentLabel
	}
	d.title = title
	d.filename = filename
	d.updatedAt = time.Now()
	return nil
}

func UnmarshalDocumentFromDatabase(id uuid.UUID, title i18n.MlString, filename string, createdAt, updatedAt time.Time) *Document {
	return &Document{
		id:        id,
		title:     title,
		filename:  filename,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
