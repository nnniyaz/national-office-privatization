package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/event"
)

// MockEventRepo is an in-memory implementation for testing
type MockEventRepo struct {
	mu     sync.RWMutex
	events map[string]*event.Event
}

func NewMockEventRepo() *MockEventRepo {
	return &MockEventRepo{
		events: make(map[string]*event.Event),
	}
}

func (m *MockEventRepo) Get(ctx context.Context) ([]*event.Event, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*event.Event, 0, len(m.events))
	for _, e := range m.events {
		result = append(result, e)
	}
	return result, nil
}

func (m *MockEventRepo) GetById(ctx context.Context, id uuid.UUID) (*event.Event, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	e, exists := m.events[id.String()]
	if !exists {
		return nil, errors.New("event not found")
	}
	return e, nil
}

func (m *MockEventRepo) Create(ctx context.Context, e *event.Event) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.events[e.GetID().String()] = e
	return nil
}

func (m *MockEventRepo) Update(ctx context.Context, e *event.Event) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.events[e.GetID().String()]; !exists {
		return errors.New("event not found")
	}
	m.events[e.GetID().String()] = e
	return nil
}

func (m *MockEventRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.events[id.String()]; !exists {
		return errors.New("event not found")
	}
	delete(m.events, id.String())
	return nil
}

