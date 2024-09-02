package partner

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/domain/partner"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	partnerService "github.com/nnniyaz/nop/service/partner"
	"net/http"
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
	Id   string `json:"id"`
	Name string `json:"name"`
	Link string `json:"link"`
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
	var p []*Partner
	for _, partner := range partners {
		p = append(p, &Partner{
			Id:   partner.GetID().String(),
			Name: partner.GetName(),
			Link: partner.GetLink(),
		})
	}
	return &Partners{
		Partners: p,
		Count:    len(partners),
	}
}

func (hd *HttpDelivery) GetPartners(w http.ResponseWriter, r *http.Request) {
	partners, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewPartners(partners))
}

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
	Name string `json:"name"`
	Link string `json:"link"`
}

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
	Id   string `json:"id"`
	Name string `json:"name"`
	Link string `json:"link"`
}

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

func (hd *HttpDelivery) DeletePartner(w http.ResponseWriter, r *http.Request) {
	partnerId := chi.URLParam(r, "partner_id")
	if err := hd.service.Delete(r.Context(), partnerId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
