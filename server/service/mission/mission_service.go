package mission

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/mission"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type MissionService interface {
	Get(ctx context.Context) (*mission.Mission, error)
	Create(ctx context.Context, text i18n.MlString) error
	Update(ctx context.Context, text i18n.MlString) error
}

type missionService struct {
	logger      logger.Logger
	missionRepo repo.Mission
}

func NewMissionService(l logger.Logger, repo repo.Mission) MissionService {
	return &missionService{logger: l, missionRepo: repo}
}

func (s *missionService) Get(ctx context.Context) (*mission.Mission, error) {
	return s.missionRepo.Get(ctx)
}

func (s *missionService) Create(ctx context.Context, text i18n.MlString) error {
	m, err := mission.NewMission(text)
	if err != nil {
		return err
	}
	return s.missionRepo.Create(ctx, m)
}

func (s *missionService) Update(ctx context.Context, text i18n.MlString) error {
	foundMission, err := s.missionRepo.Get(ctx)
	if err != nil {
		return err
	}
	if foundMission == nil {
		m, err := mission.NewMission(text)
		if err != nil {
			return err
		}
		return s.missionRepo.Create(ctx, m)
	}
	if err := foundMission.Update(text); err != nil {
		return err
	}
	return s.missionRepo.Update(ctx, foundMission)
}
