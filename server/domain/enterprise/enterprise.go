package enterprise

import (
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/enterprise/exceptions"
	"time"
)

type Enterprise struct {
	id              uuid.UUID
	name            string
	location        string
	industry        string
	governmentShare float64
	createdAt       time.Time
	updatedAt       time.Time
}

func NewEnterprise(name, location, industry string, governmentShare float64) (*Enterprise, error) {
	if name == "" {
		return nil, exceptions.ErrInvalidEnterpriseName
	}
	if location == "" {
		return nil, exceptions.ErrInvalidEnterpriseLocation
	}
	if industry == "" {
		return nil, exceptions.ErrInvalidEnterpriseIndustry
	}
	if governmentShare < 0 {
		return nil, exceptions.ErrInvalidEnterpriseGovShare
	}
	return &Enterprise{
		id:              uuid.NewUUID(),
		name:            name,
		location:        location,
		industry:        industry,
		governmentShare: governmentShare,
		createdAt:       time.Now(),
		updatedAt:       time.Now(),
	}, nil
}

func (e *Enterprise) GetID() uuid.UUID {
	return e.id
}

func (e *Enterprise) GetName() string {
	return e.name
}

func (e *Enterprise) GetLocation() string {
	return e.location
}

func (e *Enterprise) GetIndustry() string {
	return e.industry
}

func (e *Enterprise) GetGovernmentShare() float64 {
	return e.governmentShare
}

func (e *Enterprise) GetCreatedAt() time.Time {
	return e.createdAt
}

func (e *Enterprise) GetUpdatedAt() time.Time {
	return e.updatedAt
}

func (e *Enterprise) Update(name, location, industry string, governmentShare float64) error {
	if name == "" {
		return exceptions.ErrInvalidEnterpriseName
	}
	if location == "" {
		return exceptions.ErrInvalidEnterpriseLocation
	}
	if industry == "" {
		return exceptions.ErrInvalidEnterpriseIndustry
	}
	if governmentShare < 0 {
		return exceptions.ErrInvalidEnterpriseGovShare
	}
	e.name = name
	e.location = location
	e.industry = industry
	e.governmentShare = governmentShare
	e.updatedAt = time.Now()
	return nil
}

func UnmarshalEnterpriseFromDatabase(id uuid.UUID, name, location, industry string, governmentShare float64, createdAt, updatedAt time.Time) *Enterprise {
	return &Enterprise{
		id:              id,
		name:            name,
		location:        location,
		industry:        industry,
		governmentShare: governmentShare,
		createdAt:       createdAt,
		updatedAt:       updatedAt,
	}
}
