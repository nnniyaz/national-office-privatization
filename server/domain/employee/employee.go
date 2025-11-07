package employee

import (
	"errors"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

var ErrInvalidEmployeeName = errors.New("employee: name is required")

type Employee struct {
	id    uuid.UUID
	name  i18n.MlString
	group string
}

func NewEmployee(name i18n.MlString, group string) (*Employee, error) {
	if err := name.ValidateAtLeastOne(); err != nil {
		return nil, ErrInvalidEmployeeName
	}
	return &Employee{
		id:    uuid.NewUUID(),
		name:  name,
		group: group,
	}, nil
}

func (e *Employee) GetID() uuid.UUID {
	return e.id
}

func (e *Employee) GetName() i18n.MlString {
	return e.name
}

func (e *Employee) GetGroup() string {
	return e.group
}

func (e *Employee) Update(name i18n.MlString, group string) error {
	if err := name.ValidateAtLeastOne(); err != nil {
		return ErrInvalidEmployeeName
	}
	e.name = name
	e.group = group
	return nil
}

func UnmarshalEmployeeFromDatabase(id uuid.UUID, name i18n.MlString, group string) *Employee {
	return &Employee{
		id:    id,
		name:  name,
		group: group,
	}
}
