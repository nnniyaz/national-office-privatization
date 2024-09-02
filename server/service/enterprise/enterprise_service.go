package enterprise

import (
	"context"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/enterprise"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
)

type EnterpriseService interface {
	Get(ctx context.Context) ([]*enterprise.Enterprise, error)
	GetById(ctx context.Context, enterpriseId string) (*enterprise.Enterprise, error)
	Create(ctx context.Context, name, location, industry string, governmentShare float64) error
	Update(ctx context.Context, enterpriseId, name, location, industry string, governmentShare float64) error
	Delete(ctx context.Context, enterpriseId string) error
}

type enterpriseService struct {
	logger         logger.Logger
	enterpriseRepo repo.Enterprise
}

func NewEnterpriseService(l logger.Logger, repo repo.Enterprise) EnterpriseService {
	return &enterpriseService{logger: l, enterpriseRepo: repo}
}

func (s *enterpriseService) Get(ctx context.Context) ([]*enterprise.Enterprise, error) {
	return s.enterpriseRepo.Get(ctx)
}

func (s *enterpriseService) GetById(ctx context.Context, enterpriseId string) (*enterprise.Enterprise, error) {
	convertedId, err := uuid.UUIDFromString(enterpriseId)
	if err != nil {
		return nil, err
	}
	return s.enterpriseRepo.GetById(ctx, convertedId)
}

func (s *enterpriseService) Create(ctx context.Context, name, location, industry string, governmentShare float64) error {
	e, err := enterprise.NewEnterprise(name, location, industry, governmentShare)
	if err != nil {
		return err
	}
	return s.enterpriseRepo.Create(ctx, e)
}

func (s *enterpriseService) Update(ctx context.Context, enterpriseId, name, location, industry string, governmentShare float64) error {
	convertedId, err := uuid.UUIDFromString(enterpriseId)
	if err != nil {
		return err
	}
	foundEnterprise, err := s.enterpriseRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err = foundEnterprise.Update(name, location, industry, governmentShare); err != nil {
		return err
	}
	return s.enterpriseRepo.Update(ctx, foundEnterprise)
}

func (s *enterpriseService) Delete(ctx context.Context, enterpriseId string) error {
	convertedId, err := uuid.UUIDFromString(enterpriseId)
	if err != nil {
		return err
	}
	return s.enterpriseRepo.Delete(ctx, convertedId)
}
