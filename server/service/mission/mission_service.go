package mission

import (
	"context"
	"github.com/nnniyaz/nop/domain/mission"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
)

type MissionService interface {
	Get(ctx context.Context) (*mission.Mission, error)
	Create(ctx context.Context, text string) error
	Update(ctx context.Context, text string) error
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

func (s *missionService) Create(ctx context.Context, text string) error {
	m := mission.NewMission(text)
	return s.missionRepo.Create(ctx, m)
}

func (s *missionService) Update(ctx context.Context, text string) error {
	foundMission, err := s.missionRepo.Get(ctx)
	if err != nil {
		return err
	}
	foundMission.Update(text)
	return s.missionRepo.Update(ctx, foundMission)
}
