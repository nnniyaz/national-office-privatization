package npa

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/npa"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type NpaService interface {
	Get(ctx context.Context) ([]*npa.Npa, error)
	GetById(ctx context.Context, npaId string) (*npa.Npa, error)
	Create(ctx context.Context, title i18n.MlString, filename string) error
	Update(ctx context.Context, npaId string, title i18n.MlString, filename string) error
	Delete(ctx context.Context, npaId string) error
}

type npaService struct {
	logger  logger.Logger
	npaRepo repo.Npa
}

func NewNpaService(l logger.Logger, repo repo.Npa) NpaService {
	return &npaService{logger: l, npaRepo: repo}
}

func (s *npaService) Get(ctx context.Context) ([]*npa.Npa, error) {
	return s.npaRepo.Get(ctx)
}

func (s *npaService) GetById(ctx context.Context, npaId string) (*npa.Npa, error) {
	convertedId, err := uuid.UUIDFromString(npaId)
	if err != nil {
		return nil, err
	}
	return s.npaRepo.GetById(ctx, convertedId)
}

func (s *npaService) Create(ctx context.Context, title i18n.MlString, filename string) error {
	d, err := npa.NewNpa(title, filename)
	if err != nil {
		return err
	}
	return s.npaRepo.Create(ctx, d)
}

func (s *npaService) Update(ctx context.Context, npaId string, title i18n.MlString, filename string) error {
	convertedId, err := uuid.UUIDFromString(npaId)
	if err != nil {
		return err
	}
	foundNpa, err := s.npaRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err := foundNpa.Update(title, filename); err != nil {
		return err
	}
	return s.npaRepo.Update(ctx, foundNpa)
}

func (s *npaService) Delete(ctx context.Context, npaId string) error {
	convertedId, err := uuid.UUIDFromString(npaId)
	if err != nil {
		return err
	}
	return s.npaRepo.Delete(ctx, convertedId)
}
