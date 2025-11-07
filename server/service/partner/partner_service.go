package partner

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/partner"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type PartnerService interface {
	Get(ctx context.Context) ([]*partner.Partner, error)
	GetById(ctx context.Context, id string) (*partner.Partner, error)
	Create(ctx context.Context, name i18n.MlString, link string) error
	Update(ctx context.Context, id string, name i18n.MlString, link string) error
	Delete(ctx context.Context, id string) error
}

type partnerService struct {
	logger      logger.Logger
	partnerRepo repo.Partner
}

func NewPartnerService(l logger.Logger, repo repo.Partner) PartnerService {
	return &partnerService{logger: l, partnerRepo: repo}
}

func (s *partnerService) Get(ctx context.Context) ([]*partner.Partner, error) {
	return s.partnerRepo.Get(ctx)
}

func (s *partnerService) GetById(ctx context.Context, id string) (*partner.Partner, error) {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return nil, err
	}
	return s.partnerRepo.GetById(ctx, convertedId)
}

func (s *partnerService) Create(ctx context.Context, name i18n.MlString, link string) error {
	p, err := partner.NewPartner(name, link)
	if err != nil {
		return err
	}
	return s.partnerRepo.Create(ctx, p)
}

func (s *partnerService) Update(ctx context.Context, id string, name i18n.MlString, link string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	p, err := s.partnerRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	err = p.Update(name, link)
	if err != nil {
		return err
	}
	return s.partnerRepo.Update(ctx, p)
}

func (s *partnerService) Delete(ctx context.Context, id string) error {
	convertedId, err := uuid.UUIDFromString(id)
	if err != nil {
		return err
	}
	return s.partnerRepo.Delete(ctx, convertedId)
}
