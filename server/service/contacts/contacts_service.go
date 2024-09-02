package contacts

import (
	"context"
	"github.com/nnniyaz/nop/domain/contacts"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
)

type ContactsService interface {
	Get(ctx context.Context) (*contacts.Contacts, error)
	Create(ctx context.Context, primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) error
	Update(ctx context.Context, primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) error
}

type contactService struct {
	logger       logger.Logger
	contactsRepo repo.Contacts
}

func NewContactService(l logger.Logger, repo repo.Contacts) ContactsService {
	return &contactService{logger: l, contactsRepo: repo}
}

func (c *contactService) Get(ctx context.Context) (*contacts.Contacts, error) {
	return c.contactsRepo.Get(ctx)
}

func (c *contactService) Create(ctx context.Context, primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) error {
	contact, err := contacts.NewContact(primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail)
	if err != nil {
		return err
	}
	return c.contactsRepo.Create(ctx, contact)
}

func (c *contactService) Update(ctx context.Context, primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) error {
	contact, err := c.contactsRepo.Get(ctx)
	if err != nil {
		return err
	}
	if err := contact.Update(primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail); err != nil {
		return err
	}
	return c.contactsRepo.Update(ctx, contact)
}
