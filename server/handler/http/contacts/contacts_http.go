package contacts

import (
	"encoding/json"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/service/contacts"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service contacts.ContactsService
}

func NewHttpDelivery(l logger.Logger, service contacts.ContactsService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Contacts struct {
	Id                     string `json:"id"`
	PrimaryContact         string `json:"primaryContact"`
	PrimaryContactPerson   string `json:"primaryContactPerson"`
	SecondaryContact       string `json:"secondaryContact"`
	SecondaryContactPerson string `json:"secondaryContactPerson"`
	Email                  string `json:"email"`
}

func (hd *HttpDelivery) GetContacts(w http.ResponseWriter, r *http.Request) {
	foundContacts, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, Contacts{
		Id:                     foundContacts.GetID().String(),
		PrimaryContact:         foundContacts.GetPrimaryContact(),
		PrimaryContactPerson:   foundContacts.GetPrimaryContactPerson(),
		SecondaryContact:       foundContacts.GetSecondaryContact(),
		SecondaryContactPerson: foundContacts.GetSecondaryContactPerson(),
		Email:                  foundContacts.GetEmail(),
	})
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateContactIn struct {
	PrimaryContact         string `json:"primaryContact"`
	PrimaryContactPerson   string `json:"primaryContactPerson"`
	SecondaryContact       string `json:"secondaryContact"`
	SecondaryContactPerson string `json:"secondaryContactPerson"`
	Email                  string `json:"email"`
}

func (hd *HttpDelivery) CreateContact(w http.ResponseWriter, r *http.Request) {
	in := CreateContactIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.PrimaryContact, in.PrimaryContactPerson, in.SecondaryContact, in.SecondaryContactPerson, in.Email); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateContactIn struct {
	Id                     string `json:"id"`
	PrimaryContact         string `json:"primaryContact"`
	PrimaryContactPerson   string `json:"primaryContactPerson"`
	SecondaryContact       string `json:"secondaryContact"`
	SecondaryContactPerson string `json:"secondaryContactPerson"`
	Email                  string `json:"email"`
}

func (hd *HttpDelivery) UpdateContact(w http.ResponseWriter, r *http.Request) {
	in := UpdateContactIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.PrimaryContact, in.PrimaryContactPerson, in.SecondaryContact, in.SecondaryContactPerson, in.Email); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
