package news

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/news/exceptions"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type News struct {
	id        uuid.UUID
	title     i18n.MlString
	content   i18n.MlString
	imgUrl    string
	createdAt time.Time
}

func NewNews(title, content i18n.MlString, imgUrl string) (*News, error) {
	if err := title.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidNewsTitle
	}
	if err := content.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidNewsContent
	}
	return &News{
		id:        uuid.NewUUID(),
		title:     title,
		content:   content,
		imgUrl:    imgUrl,
		createdAt: time.Now(),
	}, nil
}

func (n *News) GetID() uuid.UUID {
	return n.id
}

func (n *News) GetTitle() i18n.MlString {
	return n.title
}

func (n *News) GetContent() i18n.MlString {
	return n.content
}

func (n *News) GetImgUrl() string {
	return n.imgUrl
}

func (n *News) GetCreatedAt() time.Time {
	return n.createdAt
}

func (n *News) Update(title, content i18n.MlString, imgUrl string) error {
	if err := title.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidNewsTitle
	}
	if err := content.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidNewsContent
	}
	n.title = title
	n.content = content
	n.imgUrl = imgUrl
	return nil
}

func UnmarshalNewsFromDatabase(id uuid.UUID, title, content i18n.MlString, imgUrl string, createdAt time.Time) *News {
	return &News{
		id:        id,
		title:     title,
		content:   content,
		imgUrl:    imgUrl,
		createdAt: createdAt,
	}
}
