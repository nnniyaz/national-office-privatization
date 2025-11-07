package partner

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/partner/exceptions"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type Partner struct {
	id   uuid.UUID
	name i18n.MlString
	link string
}

func NewPartner(name i18n.MlString, link string) (*Partner, error) {
	if err := name.ValidateAtLeastOne(); err != nil {
		return nil, exceptions.ErrInvalidPartnerName
	}
	if link == "" {
		return nil, exceptions.ErrInvalidPartnerLink
	}
	return &Partner{
		id:   uuid.NewUUID(),
		name: name,
		link: link,
	}, nil
}

func (p *Partner) GetID() uuid.UUID {
	return p.id
}

func (p *Partner) GetName() i18n.MlString {
	return p.name
}

func (p *Partner) GetLink() string {
	return p.link
}

func (p *Partner) Update(name i18n.MlString, link string) error {
	if err := name.ValidateAtLeastOne(); err != nil {
		return exceptions.ErrInvalidPartnerName
	}
	if link == "" {
		return exceptions.ErrInvalidPartnerLink
	}
	p.name = name
	p.link = link
	return nil
}

func UnmarshalPartnerFromDatabase(id uuid.UUID, name i18n.MlString, link string) *Partner {
	return &Partner{
		id:   id,
		name: name,
		link: link,
	}
}
