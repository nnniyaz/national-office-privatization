package mission

import (
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/internal/i18n"
)

type Mission struct {
	id   uuid.UUID
	text i18n.MlString
}

func NewMission(text i18n.MlString) (*Mission, error) {
	if err := text.ValidateAtLeastOne(); err != nil {
		return nil, err
	}
	return &Mission{
		id:   uuid.NewUUID(),
		text: text,
	}, nil
}

func (m *Mission) GetID() uuid.UUID {
	return m.id
}

func (m *Mission) GetText() i18n.MlString {
	return m.text
}

func (m *Mission) Update(text i18n.MlString) error {
	if err := text.ValidateAtLeastOne(); err != nil {
		return err
	}
	m.text = text
	return nil
}

func UnmarshalMissionFromDatabase(id uuid.UUID, text i18n.MlString) *Mission {
	return &Mission{
		id:   id,
		text: text,
	}
}
