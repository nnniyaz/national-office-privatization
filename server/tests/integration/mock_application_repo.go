package integration

import (
	"context"
	"errors"
	"sort"
	"sync"
	"time"

	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
)

type MockApplicationRepo struct {
	mu           sync.RWMutex
	applications map[string]*application.Application
	failWith     error
}

func NewMockApplicationRepo() *MockApplicationRepo {
	return &MockApplicationRepo{
		applications: make(map[string]*application.Application),
	}
}

// FailWith makes every subsequent repo call return err
func (m *MockApplicationRepo) FailWith(err error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.failWith = err
}

func (m *MockApplicationRepo) Get(ctx context.Context) ([]*application.Application, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*application.Application, 0, len(m.applications))
	for _, a := range m.applications {
		result = append(result, a)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].GetCreatedAt().After(result[j].GetCreatedAt())
	})
	return result, nil
}

func (m *MockApplicationRepo) GetByPeriod(ctx context.Context, from, to *time.Time) ([]*application.Application, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if m.failWith != nil {
		return nil, m.failWith
	}

	result := make([]*application.Application, 0, len(m.applications))
	for _, a := range m.applications {
		if from != nil && a.GetCreatedAt().Before(*from) {
			continue
		}
		if to != nil && a.GetCreatedAt().After(*to) {
			continue
		}
		result = append(result, a)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].GetCreatedAt().Before(result[j].GetCreatedAt())
	})
	return result, nil
}

func (m *MockApplicationRepo) GetById(ctx context.Context, id uuid.UUID) (*application.Application, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	a, exists := m.applications[id.String()]
	if !exists {
		return nil, errors.New("application not found")
	}
	return a, nil
}

func (m *MockApplicationRepo) Create(ctx context.Context, a *application.Application) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.applications[a.GetID().String()] = a
	return nil
}

func (m *MockApplicationRepo) Update(ctx context.Context, a *application.Application) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.applications[a.GetID().String()]; !exists {
		return errors.New("application not found")
	}
	m.applications[a.GetID().String()] = a
	return nil
}

func (m *MockApplicationRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.applications[id.String()]; !exists {
		return errors.New("application not found")
	}
	delete(m.applications, id.String())
	return nil
}
