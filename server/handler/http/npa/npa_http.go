package npa

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/npa"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	npaService "github.com/nnniyaz/nop/server/service/npa"
)

type HttpDelivery struct {
	logger  logger.Logger
	service npaService.NpaService
}

func NewHttpDelivery(l logger.Logger, service npaService.NpaService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Npa struct {
	Id        string        `json:"id"`
	Title     i18n.MlString `json:"title"`
	Filename  string        `json:"filename"`
	CreatedAt string        `json:"createdAt"`
	UpdatedAt string        `json:"updatedAt"`
}

func NewNpa(d *npa.Npa) *Npa {
	return &Npa{
		Id:        d.GetID().String(),
		Title:     d.GetTitle(),
		Filename:  d.GetFilename(),
		CreatedAt: d.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt: d.GetUpdatedAt().Format(time.RFC3339),
	}
}

type Npas struct {
	Npas  []*Npa `json:"npas"`
	Count int    `json:"count"`
}

func NewNpas(npas []*npa.Npa) *Npas {
	var npasList []*Npa
	for _, d := range npas {
		npasList = append(npasList, NewNpa(d))
	}
	return &Npas{
		npasList,
		len(npasList),
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

// GetNpas godoc
//
//	@Summary		Get all NPAs
//	@Description	Retrieves a list of all normative legal acts with multilingual titles
//	@Tags			npa
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Npas
//	@Failure		500	{object}	response.Error
//	@Router			/api/npa [get]
func (hd *HttpDelivery) GetNpas(w http.ResponseWriter, r *http.Request) {
	foundNpas, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNpas(foundNpas))
}

// GetNpaById godoc
//
//	@Summary		Get NPA by ID
//	@Description	Retrieves a single NPA by its ID
//	@Tags			npa
//	@Accept			json
//	@Produce		json
//	@Param			npa_id	path		string	true	"NPA ID"
//	@Success		200		{object}	Npa
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/npa/{npa_id} [get]
func (hd *HttpDelivery) GetNpaById(w http.ResponseWriter, r *http.Request) {
	npaId := chi.URLParam(r, "npa_id")
	foundNpa, err := hd.service.GetById(r.Context(), npaId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNpa(foundNpa))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateNpaIn struct {
	Title    i18n.MlString `json:"title"`
	Filename string        `json:"filename"`
}

// CreateNpa godoc
//
//	@Summary		Create a new NPA
//	@Description	Creates a new normative legal act with multilingual title
//	@Tags			npa
//	@Accept			json
//	@Produce		json
//	@Param			npa	body		CreateNpaIn	true	"NPA data"
//	@Success		200	{object}	response.Success
//	@Failure		400	{object}	response.Error
//	@Failure		500	{object}	response.Error
//	@Router			/api/npa [post]
//	@Security		Bearer
func (hd *HttpDelivery) CreateNpa(w http.ResponseWriter, r *http.Request) {
	var in CreateNpaIn
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

type UpdateNpaIn struct {
	Id       string        `json:"id"`
	Title    i18n.MlString `json:"title"`
	Filename string        `json:"filename"`
}

// UpdateNpa godoc
//
//	@Summary		Update an NPA
//	@Description	Updates an existing normative legal act
//	@Tags			npa
//	@Accept			json
//	@Produce		json
//	@Param			npa	body		UpdateNpaIn	true	"NPA update data"
//	@Success		200	{object}	response.Success
//	@Failure		400	{object}	response.Error
//	@Failure		404	{object}	response.Error
//	@Failure		500	{object}	response.Error
//	@Router			/api/npa [put]
//	@Security		Bearer
func (hd *HttpDelivery) UpdateNpa(w http.ResponseWriter, r *http.Request) {
	var in UpdateNpaIn
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

// DeleteNpa godoc
//
//	@Summary		Delete an NPA
//	@Description	Deletes a normative legal act by ID
//	@Tags			npa
//	@Accept			json
//	@Produce		json
//	@Param			npa_id	path		string	true	"NPA ID"
//	@Success		200		{object}	response.Success
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/npa/{npa_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeleteNpa(w http.ResponseWriter, r *http.Request) {
	npaId := chi.URLParam(r, "npa_id")
	if err := hd.service.Delete(r.Context(), npaId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
