package employee

import "github.com/nnniyaz/nop/server/domain/base/uuid"

type Employee struct {
	id    uuid.UUID
	name  string
	group string
}

func NewEmployee(name string, group string) *Employee {
	return &Employee{
		id:    uuid.NewUUID(),
		name:  name,
		group: group,
	}
}

func (e *Employee) GetID() uuid.UUID {
	return e.id
}

func (e *Employee) GetName() string {
	return e.name
}

func (e *Employee) GetGroup() string {
	return e.group
}

func (e *Employee) Update(name string, group string) {
	e.name = name
}

func UnmarshalEmployeeFromDatabase(id uuid.UUID, name, group string) *Employee {
	return &Employee{
		id:    id,
		name:  name,
		group: group,
	}
}
