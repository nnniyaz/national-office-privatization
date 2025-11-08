package integration

import (
	"context"
	"errors"
	"sync"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/document"
)

// MockDocumentRepo is an in-memory implementation for testing
type MockDocumentRepo struct {
	mu        sync.RWMutex
	documents map[string]*document.Document
}

func NewMockDocumentRepo() *MockDocumentRepo {
	return &MockDocumentRepo{
		documents: make(map[string]*document.Document),
	}
}

func (m *MockDocumentRepo) Get(ctx context.Context) ([]*document.Document, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*document.Document, 0, len(m.documents))
	for _, doc := range m.documents {
		result = append(result, doc)
	}
	return result, nil
}

func (m *MockDocumentRepo) GetById(ctx context.Context, id uuid.UUID) (*document.Document, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	doc, exists := m.documents[id.String()]
	if !exists {
		return nil, errors.New("document not found")
	}
	return doc, nil
}

func (m *MockDocumentRepo) Create(ctx context.Context, d *document.Document) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.documents[d.GetID().String()] = d
	return nil
}

func (m *MockDocumentRepo) Update(ctx context.Context, d *document.Document) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.documents[d.GetID().String()]; !exists {
		return errors.New("document not found")
	}
	m.documents[d.GetID().String()] = d
	return nil
}

func (m *MockDocumentRepo) Delete(ctx context.Context, id uuid.UUID) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.documents[id.String()]; !exists {
		return errors.New("document not found")
	}
	delete(m.documents, id.String())
	return nil
}

