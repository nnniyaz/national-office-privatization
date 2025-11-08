package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/employee"
)

type MockEmployeeRepo struct {
	mu        sync.RWMutex
	employees map[string]*employee.Employee
}

func NewMockEmployeeRepo() *MockEmployeeRepo {
	return &MockEmployeeRepo{
		employees: make(map[string]*employee.Employee),
	}
}

func (m *MockEmployeeRepo) Get(ctx context.Context) ([]*employee.Employee, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*employee.Employee, 0, len(m.employees))
	for _, e := range m.employees {
		result = append(result, e)
	}
	return result, nil
}

func (m *MockEmployeeRepo) GetById(ctx context.Context, id uuid.UUID) (*employee.Employee, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	e, exists := m.employees[id.String()]
	if !exists {
		return nil, errors.New("employee not found")
	}
	return e, nil
}

func (m *MockEmployeeRepo) Create(ctx context.Context, e *employee.Employee) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.employees[e.GetID().String()] = e
	return nil
}

func (m *MockEmployeeRepo) Update(ctx context.Context, e *employee.Employee) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.employees[e.GetID().String()]; !exists {
		return errors.New("employee not found")
	}
	m.employees[e.GetID().String()] = e
	return nil
}

func (m *MockEmployeeRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.employees[id.String()]; !exists {
		return errors.New("employee not found")
	}
	delete(m.employees, id.String())
	return nil
}

