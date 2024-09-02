package news

import (
	"context"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/news"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
)

type NewsService interface {
	Get(ctx context.Context) ([]*news.News, error)
	GetById(ctx context.Context, newsId string) (*news.News, error)
	Create(ctx context.Context, title, content, imgUrl string) error
	Update(ctx context.Context, newsId, title, content, imgUrl string) error
	Delete(ctx context.Context, newsId string) error
}

type newsService struct {
	logger   logger.Logger
	newsRepo repo.News
}

func NewNewsService(l logger.Logger, repo repo.News) NewsService {
	return &newsService{logger: l, newsRepo: repo}
}

func (s *newsService) Get(ctx context.Context) ([]*news.News, error) {
	return s.newsRepo.Get(ctx)
}

func (s *newsService) GetById(ctx context.Context, newsId string) (*news.News, error) {
	convertedId, err := uuid.UUIDFromString(newsId)
	if err != nil {
		return nil, err
	}
	return s.newsRepo.GetById(ctx, convertedId)
}

func (s *newsService) Create(ctx context.Context, title, content, imgUrl string) error {
	n, err := news.NewNews(title, content, imgUrl)
	if err != nil {
		return err
	}
	return s.newsRepo.Create(ctx, n)
}

func (s *newsService) Update(ctx context.Context, newsId, title, content, imgUrl string) error {
	convertedId, err := uuid.UUIDFromString(newsId)
	if err != nil {
		return err
	}
	n, err := s.newsRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	err = n.Update(title, content, imgUrl)
	if err != nil {
		return err
	}
	return s.newsRepo.Update(ctx, n)
}

func (s *newsService) Delete(ctx context.Context, newsId string) error {
	convertedId, err := uuid.UUIDFromString(newsId)
	if err != nil {
		return err
	}
	return s.newsRepo.Delete(ctx, convertedId)
}
