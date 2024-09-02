package news

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/news/exceptions"
	"time"
)

type News struct {
	id        uuid.UUID
	title     string
	content   string
	imgUrl    string
	createdAt time.Time
}

func NewNews(title, content, imgUrl string) (*News, error) {
	if title == "" {
		return nil, exceptions.ErrInvalidNewsTitle
	}
	if content == "" {
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

func (n *News) GetTitle() string {
	return n.title
}

func (n *News) GetContent() string {
	return n.content
}

func (n *News) GetImgUrl() string {
	return n.imgUrl
}

func (n *News) GetCreatedAt() time.Time {
	return n.createdAt
}

func (n *News) Update(title, content, imgUrl string) error {
	if title == "" {
		return exceptions.ErrInvalidNewsTitle
	}
	if content == "" {
		return exceptions.ErrInvalidNewsContent
	}
	n.title = title
	n.content = content
	n.imgUrl = imgUrl
	return nil
}

func UnmarshalNewsFromDatabase(id uuid.UUID, title, content, imgUrl string, createdAt time.Time) *News {
	return &News{
		id:        id,
		title:     title,
		content:   content,
		imgUrl:    imgUrl,
		createdAt: createdAt,
	}
}
