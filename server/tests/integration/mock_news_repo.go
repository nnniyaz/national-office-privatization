package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/news"
)

// MockNewsRepo is an in-memory implementation for testing
type MockNewsRepo struct {
	mu   sync.RWMutex
	news map[string]*news.News
}

func NewMockNewsRepo() *MockNewsRepo {
	return &MockNewsRepo{
		news: make(map[string]*news.News),
	}
}

func (m *MockNewsRepo) Get(ctx context.Context) ([]*news.News, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*news.News, 0, len(m.news))
	for _, n := range m.news {
		result = append(result, n)
	}
	return result, nil
}

func (m *MockNewsRepo) GetById(ctx context.Context, id uuid.UUID) (*news.News, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	n, exists := m.news[id.String()]
	if !exists {
		return nil, errors.New("news not found")
	}
	return n, nil
}

func (m *MockNewsRepo) Create(ctx context.Context, n *news.News) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.news[n.GetID().String()] = n
	return nil
}

func (m *MockNewsRepo) Update(ctx context.Context, n *news.News) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.news[n.GetID().String()]; !exists {
		return errors.New("news not found")
	}
	m.news[n.GetID().String()] = n
	return nil
}

func (m *MockNewsRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.news[id.String()]; !exists {
		return errors.New("news not found")
	}
	delete(m.news, id.String())
	return nil
}

