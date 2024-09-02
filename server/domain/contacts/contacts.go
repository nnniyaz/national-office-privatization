package contacts

import (
	"github.com/nnniyaz/nop/server/domain/base/email"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/contacts/exceptions"
)

type Contacts struct {
	id                     uuid.UUID
	primaryContact         string
	primaryContactPerson   string
	secondaryContact       string
	secondaryContactPerson string
	email                  email.Email
}

func NewContact(primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) (*Contacts, error) {
	if primaryContact == "" {
		return nil, exceptions.ErrInvalidPrimaryContact
	}

	if secondaryContact == "" {
		return nil, exceptions.ErrInvalidSecondaryContact
	}

	contactEmail, err := email.NewEmail(mail)
	if err != nil {
		return nil, err
	}

	return &Contacts{
		id:                     uuid.NewUUID(),
		primaryContact:         primaryContact,
		primaryContactPerson:   primaryContactPerson,
		secondaryContact:       secondaryContact,
		secondaryContactPerson: secondaryContactPerson,
		email:                  contactEmail,
	}, nil
}

func (c *Contacts) GetID() uuid.UUID {
	return c.id
}

func (c *Contacts) GetPrimaryContact() string {
	return c.primaryContact
}

func (c *Contacts) GetPrimaryContactPerson() string {
	return c.primaryContactPerson
}

func (c *Contacts) GetSecondaryContact() string {
	return c.secondaryContact
}

func (c *Contacts) GetSecondaryContactPerson() string {
	return c.secondaryContactPerson
}

func (c *Contacts) GetEmail() string {
	return c.email.String()
}

func (c *Contacts) Update(primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) error {
	if primaryContact == "" {
		return exceptions.ErrInvalidPrimaryContact
	}
	if secondaryContact == "" {
		return exceptions.ErrInvalidSecondaryContact
	}
	contactEmail, err := email.NewEmail(mail)
	if err != nil {
		return err
	}
	c.primaryContact = primaryContact
	c.primaryContactPerson = primaryContactPerson
	c.secondaryContact = secondaryContact
	c.secondaryContactPerson = secondaryContactPerson
	c.email = contactEmail
	return nil
}

func UnmarshalContactsFromDatabase(id uuid.UUID, primaryContact, primaryContactPerson, secondaryContact, secondaryContactPerson, mail string) *Contacts {
	return &Contacts{
		id:                     id,
		primaryContact:         primaryContact,
		primaryContactPerson:   primaryContactPerson,
		secondaryContact:       secondaryContact,
		secondaryContactPerson: secondaryContactPerson,
		email:                  email.Email(mail),
	}
}
