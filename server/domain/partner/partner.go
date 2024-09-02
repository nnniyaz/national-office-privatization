package partner

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/partner/exceptions"
)

type Partner struct {
	id   uuid.UUID
	name string
	link string
}

func NewPartner(name, link string) (*Partner, error) {
	if name == "" {
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

func (p *Partner) GetName() string {
	return p.name
}

func (p *Partner) GetLink() string {
	return p.link
}

func (p *Partner) Update(name, link string) error {
	if name == "" {
		return exceptions.ErrInvalidPartnerName
	}
	if link == "" {
		return exceptions.ErrInvalidPartnerLink
	}
	p.name = name
	p.link = link
	return nil
}

func UnmarshalPartnerFromDatabase(id uuid.UUID, name, link string) *Partner {
	return &Partner{
		id:   id,
		name: name,
		link: link,
	}
}
