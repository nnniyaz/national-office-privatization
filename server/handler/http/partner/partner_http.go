package partner

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/partner"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	partnerService "github.com/nnniyaz/nop/server/service/partner"
)

type HttpDelivery struct {
	logger  logger.Logger
	service partnerService.PartnerService
}

func NewHttpDelivery(l logger.Logger, service partnerService.PartnerService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Partner struct {
	Id   string        `json:"id"`
	Name i18n.MlString `json:"name"`
	Link string        `json:"link"`
}

func NewPartner(p *partner.Partner) *Partner {
	return &Partner{
		Id:   p.GetID().String(),
		Name: p.GetName(),
		Link: p.GetLink(),
	}
}

type Partners struct {
	Partners []*Partner `json:"partners"`
	Count    int        `json:"count"`
}

func NewPartners(partners []*partner.Partner) *Partners {
	var list []*Partner
	for _, p := range partners {
		list = append(list, &Partner{
			Id:   p.GetID().String(),
			Name: p.GetName(),
			Link: p.GetLink(),
		})
	}
	return &Partners{
		Partners: list,
		Count:    len(partners),
	}
}

// GetPartners godoc
//
//	@Summary		Get all partners
//	@Description	Retrieves a list of all partners with multilingual names
//	@Tags			partners
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Partners
//	@Failure		500	{object}	response.Error
//	@Router			/api/partner [get]
func (hd *HttpDelivery) GetPartners(w http.ResponseWriter, r *http.Request) {
	partners, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewPartners(partners))
}

// GetPartnerById godoc
//
//	@Summary		Get partner by ID
//	@Description	Retrieves a single partner by its ID
//	@Tags			partners
//	@Accept			json
//	@Produce		json
//	@Param			partner_id	path		string	true	"Partner ID"
//	@Success		200			{object}	Partner
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/partner/{partner_id} [get]
//	@Security		Bearer
func (hd *HttpDelivery) GetPartnerById(w http.ResponseWriter, r *http.Request) {
	partnerId := chi.URLParam(r, "partner_id")
	p, err := hd.service.GetById(r.Context(), partnerId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewPartner(p))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreatePartnerIn struct {
	Name i18n.MlString `json:"name"`
	Link string        `json:"link"`
}

// CreatePartner godoc
//
//	@Summary		Create a new partner
//	@Description	Creates a new partner with multilingual name
//	@Tags			partners
//	@Accept			json
//	@Produce		json
//	@Param			partner	body		CreatePartnerIn	true	"Partner data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/partner [post]
//	@Security		Bearer
func (hd *HttpDelivery) CreatePartner(w http.ResponseWriter, r *http.Request) {
	in := CreatePartnerIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Create(r.Context(), in.Name, in.Link); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdatePartnerIn struct {
	Id   string        `json:"id"`
	Name i18n.MlString `json:"name"`
	Link string        `json:"link"`
}

// UpdatePartner godoc
//
//	@Summary		Update a partner
//	@Description	Updates an existing partner
//	@Tags			partners
//	@Accept			json
//	@Produce		json
//	@Param			partner	body		UpdatePartnerIn	true	"Partner update data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/partner [put]
//	@Security		Bearer
func (hd *HttpDelivery) UpdatePartner(w http.ResponseWriter, r *http.Request) {
	in := UpdatePartnerIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Update(r.Context(), in.Id, in.Name, in.Link); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

// DeletePartner godoc
//
//	@Summary		Delete a partner
//	@Description	Deletes a partner by ID
//	@Tags			partners
//	@Accept			json
//	@Produce		json
//	@Param			partner_id	path		string	true	"Partner ID"
//	@Success		200			{object}	response.Success
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/partner/{partner_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeletePartner(w http.ResponseWriter, r *http.Request) {
	partnerId := chi.URLParam(r, "partner_id")
	if err := hd.service.Delete(r.Context(), partnerId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
