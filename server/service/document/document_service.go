package document

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/document"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type DocumentService interface {
	Get(ctx context.Context) ([]*document.Document, error)
	GetById(ctx context.Context, documentId string) (*document.Document, error)
	Create(ctx context.Context, title i18n.MlString, filename string) error
	Update(ctx context.Context, documentId string, title i18n.MlString, filename string) error
	Delete(ctx context.Context, documentId string) error
}

type documentService struct {
	logger       logger.Logger
	documentRepo repo.Document
}

func NewDocumentService(l logger.Logger, repo repo.Document) DocumentService {
	return &documentService{logger: l, documentRepo: repo}
}

func (s *documentService) Get(ctx context.Context) ([]*document.Document, error) {
	return s.documentRepo.Get(ctx)
}

func (s *documentService) GetById(ctx context.Context, documentId string) (*document.Document, error) {
	convertedId, err := uuid.UUIDFromString(documentId)
	if err != nil {
		return nil, err
	}
	return s.documentRepo.GetById(ctx, convertedId)
}

func (s *documentService) Create(ctx context.Context, title i18n.MlString, filename string) error {
	d, err := document.NewDocument(title, filename)
	if err != nil {
		return err
	}
	return s.documentRepo.Create(ctx, d)
}

func (s *documentService) Update(ctx context.Context, documentId string, title i18n.MlString, filename string) error {
	convertedId, err := uuid.UUIDFromString(documentId)
	if err != nil {
		return err
	}
	foundDocument, err := s.documentRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	if err := foundDocument.Update(title, filename); err != nil {
		return err
	}
	return s.documentRepo.Update(ctx, foundDocument)
}

func (s *documentService) Delete(ctx context.Context, documentId string) error {
	convertedId, err := uuid.UUIDFromString(documentId)
	if err != nil {
		return err
	}
	return s.documentRepo.Delete(ctx, convertedId)
}
