package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/partner"
)

type MockPartnerRepo struct {
	mu       sync.RWMutex
	partners map[string]*partner.Partner
}

func NewMockPartnerRepo() *MockPartnerRepo {
	return &MockPartnerRepo{
		partners: make(map[string]*partner.Partner),
	}
}

func (m *MockPartnerRepo) Get(ctx context.Context) ([]*partner.Partner, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*partner.Partner, 0, len(m.partners))
	for _, p := range m.partners {
		result = append(result, p)
	}
	return result, nil
}

func (m *MockPartnerRepo) GetById(ctx context.Context, id uuid.UUID) (*partner.Partner, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	p, exists := m.partners[id.String()]
	if !exists {
		return nil, errors.New("partner not found")
	}
	return p, nil
}

func (m *MockPartnerRepo) Create(ctx context.Context, p *partner.Partner) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.partners[p.GetID().String()] = p
	return nil
}

func (m *MockPartnerRepo) Update(ctx context.Context, p *partner.Partner) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.partners[p.GetID().String()]; !exists {
		return errors.New("partner not found")
	}
	m.partners[p.GetID().String()] = p
	return nil
}

func (m *MockPartnerRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.partners[id.String()]; !exists {
		return errors.New("partner not found")
	}
	delete(m.partners, id.String())
	return nil
}

