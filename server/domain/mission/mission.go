package mission

import "github.com/nnniyaz/nop/domain/base/uuid"

type Mission struct {
	id   uuid.UUID
	text string
}

func NewMission(text string) *Mission {
	return &Mission{
		id:   uuid.NewUUID(),
		text: text,
	}
}

func (m *Mission) GetID() uuid.UUID {
	return m.id
}

func (m *Mission) GetText() string {
	return m.text
}

func (m *Mission) Update(text string) {
	m.text = text
}

func UnmarshalMissionFromDatabase(id uuid.UUID, text string) *Mission {
	return &Mission{
		id:   id,
		text: text,
	}
}
