package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/mission"
)

type MockMissionRepo struct {
	mu       sync.RWMutex
	missions map[string]*mission.Mission
}

func NewMockMissionRepo() *MockMissionRepo {
	return &MockMissionRepo{
		missions: make(map[string]*mission.Mission),
	}
}

func (m *MockMissionRepo) Get(ctx context.Context) (*mission.Mission, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Mission is singleton - return first one or nil if doesn't exist
	for _, mission := range m.missions {
		return mission, nil
	}
	// Return nil without error when mission doesn't exist yet
	return nil, nil
}

func (m *MockMissionRepo) Create(ctx context.Context, mission *mission.Mission) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.missions[mission.GetID().String()] = mission
	return nil
}

func (m *MockMissionRepo) Update(ctx context.Context, mission *mission.Mission) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.missions[mission.GetID().String()]; !exists {
		return errors.New("mission not found")
	}
	m.missions[mission.GetID().String()] = mission
	return nil
}

