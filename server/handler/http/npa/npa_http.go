package npa

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/domain/npa"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	npaService "github.com/nnniyaz/nop/service/npa"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service npaService.NpaService
}

func NewHttpDelivery(l logger.Logger, service npaService.NpaService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Npa struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	Filename  string `json:"filename"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
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

func (hd *HttpDelivery) GetNpas(w http.ResponseWriter, r *http.Request) {
	foundNpas, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNpas(foundNpas))
}

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
	Title    string `json:"title"`
	Filename string `json:"filename"`
}

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
	Id       string `json:"id"`
	Title    string `json:"title"`
	Filename string `json:"filename"`
}

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

func (hd *HttpDelivery) DeleteNpa(w http.ResponseWriter, r *http.Request) {
	npaId := chi.URLParam(r, "npa_id")
	if err := hd.service.Delete(r.Context(), npaId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
