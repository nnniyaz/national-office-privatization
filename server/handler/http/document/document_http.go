package document

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/document"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	documentService "github.com/nnniyaz/nop/server/service/document"
)

type HttpDelivery struct {
	logger  logger.Logger
	service documentService.DocumentService
}

func NewHttpDelivery(l logger.Logger, service documentService.DocumentService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Document struct {
	Id        string        `json:"id"`
	Title     i18n.MlString `json:"title"`
	Filename  string        `json:"filename"`
	CreatedAt string        `json:"createdAt"`
	UpdatedAt string        `json:"updatedAt"`
}

func NewDocument(d *document.Document) *Document {
	return &Document{
		Id:        d.GetID().String(),
		Title:     d.GetTitle(),
		Filename:  d.GetFilename(),
		CreatedAt: d.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt: d.GetUpdatedAt().Format(time.RFC3339),
	}
}

type Documents struct {
	Documents []*Document `json:"documents"`
	Count     int         `json:"count"`
}

func NewDocuments(documents []*document.Document) *Documents {
	var documentsList []*Document
	for _, d := range documents {
		documentsList = append(documentsList, NewDocument(d))
	}
	return &Documents{
		documentsList,
		len(documentsList),
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

// GetDocuments godoc
//
//	@Summary		Get all documents
//	@Description	Retrieves a list of all documents with multilingual titles
//	@Tags			documents
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Documents
//	@Failure		500	{object}	response.Error
//	@Router			/api/document [get]
//	@Security		Bearer
func (hd *HttpDelivery) GetDocuments(w http.ResponseWriter, r *http.Request) {
	foundDocuments, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewDocuments(foundDocuments))
}

// GetDocumentById godoc
//
//	@Summary		Get document by ID
//	@Description	Retrieves a single document by its ID
//	@Tags			documents
//	@Accept			json
//	@Produce		json
//	@Param			document_id	path		string	true	"Document ID"
//	@Success		200			{object}	Document
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/document/{document_id} [get]
//	@Security		Bearer
func (hd *HttpDelivery) GetDocumentById(w http.ResponseWriter, r *http.Request) {
	documentId := chi.URLParam(r, "document_id")
	foundDocument, err := hd.service.GetById(r.Context(), documentId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewDocument(foundDocument))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateDocumentIn struct {
	Title    i18n.MlString `json:"title"`
	Filename string        `json:"filename"`
}

// CreateDocument godoc
//
//	@Summary		Create a new document
//	@Description	Creates a new document with multilingual title
//	@Tags			documents
//	@Accept			json
//	@Produce		json
//	@Param			document	body		CreateDocumentIn	true	"Document data"
//	@Success		200			{object}	response.Success
//	@Failure		400			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/document [post]
//	@Security		Bearer
func (hd *HttpDelivery) CreateDocument(w http.ResponseWriter, r *http.Request) {
	var in CreateDocumentIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.Title, in.Filename); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateDocumentIn struct {
	Id       string        `json:"id"`
	Title    i18n.MlString `json:"title"`
	Filename string        `json:"filename"`
}

// UpdateDocument godoc
//
//	@Summary		Update a document
//	@Description	Updates an existing document
//	@Tags			documents
//	@Accept			json
//	@Produce		json
//	@Param			document	body		UpdateDocumentIn	true	"Document update data"
//	@Success		200			{object}	response.Success
//	@Failure		400			{object}	response.Error
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/document [put]
//	@Security		Bearer
func (hd *HttpDelivery) UpdateDocument(w http.ResponseWriter, r *http.Request) {
	var in UpdateDocumentIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.Title, in.Filename); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteDocument godoc
//
//	@Summary		Delete a document
//	@Description	Deletes a document by ID
//	@Tags			documents
//	@Accept			json
//	@Produce		json
//	@Param			document_id	path		string	true	"Document ID"
//	@Success		200			{object}	response.Success
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/document/{document_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeleteDocument(w http.ResponseWriter, r *http.Request) {
	documentId := chi.URLParam(r, "document_id")
	if err := hd.service.Delete(r.Context(), documentId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
