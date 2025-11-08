package integration

import (
	"context"
	"errors"
	"strings"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/enterprise"
)

type MockEnterpriseRepo struct {
	mu          sync.RWMutex
	enterprises map[string]*enterprise.Enterprise
}

func NewMockEnterpriseRepo() *MockEnterpriseRepo {
	return &MockEnterpriseRepo{
		enterprises: make(map[string]*enterprise.Enterprise),
	}
}

func (m *MockEnterpriseRepo) Get(ctx context.Context, offset, limit int64, search, region, field string) ([]*enterprise.Enterprise, int64, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*enterprise.Enterprise, 0)
	
	// Simple filtering by search term in name
	for _, e := range m.enterprises {
		if search == "" || strings.Contains(strings.ToLower(e.GetName()), strings.ToLower(search)) {
			result = append(result, e)
		}
	}

	// Apply pagination
	start := int(offset)
	end := start + int(limit)
	
	if start > len(result) {
		return []*enterprise.Enterprise{}, int64(len(result)), nil
	}
	if end > len(result) {
		end = len(result)
	}
	if limit == 0 {
		end = len(result)
	}

	return result[start:end], int64(len(result)), nil
}

func (m *MockEnterpriseRepo) GetById(ctx context.Context, id uuid.UUID) (*enterprise.Enterprise, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	e, exists := m.enterprises[id.String()]
	if !exists {
		return nil, errors.New("enterprise not found")
	}
	return e, nil
}

func (m *MockEnterpriseRepo) Create(ctx context.Context, e *enterprise.Enterprise) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.enterprises[e.GetID().String()] = e
	return nil
}

func (m *MockEnterpriseRepo) Update(ctx context.Context, e *enterprise.Enterprise) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.enterprises[e.GetID().String()]; !exists {
		return errors.New("enterprise not found")
	}
	m.enterprises[e.GetID().String()] = e
	return nil
}

func (m *MockEnterpriseRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.enterprises[id.String()]; !exists {
		return errors.New("enterprise not found")
	}
	delete(m.enterprises, id.String())
	return nil
}

