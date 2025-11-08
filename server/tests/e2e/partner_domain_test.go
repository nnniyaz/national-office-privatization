package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/partner"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPartner_NewPartner_Success(t *testing.T) {
	name := i18n.MlString{
		KZ: "Серіктес атауы",
		RU: "Название партнера",
		EN: "Partner Name",
	}

	p, err := partner.NewPartner(name, "https://example.com")

	require.NoError(t, err)
	assert.NotNil(t, p)
	assert.Equal(t, name, p.GetName())
	assert.Equal(t, "https://example.com", p.GetLink())
}

func TestPartner_NewPartner_EmptyName_ShouldFail(t *testing.T) {
	emptyName := i18n.MlString{}

	p, err := partner.NewPartner(emptyName, "https://example.com")

	assert.Error(t, err)
	assert.Nil(t, p)
}

func TestPartner_NewPartner_EmptyLink_ShouldFail(t *testing.T) {
	name := i18n.MlString{EN: "Partner"}

	p, err := partner.NewPartner(name, "")

	assert.Error(t, err)
	assert.Nil(t, p)
}

func TestPartner_Update_Success(t *testing.T) {
	oldName := i18n.MlString{EN: "Old Partner"}
	p, err := partner.NewPartner(oldName, "https://old.com")
	require.NoError(t, err)

	newName := i18n.MlString{
		KZ: "Жаңа серіктес",
		RU: "Новый партнер",
		EN: "New Partner",
	}

	err = p.Update(newName, "https://new.com")

	assert.NoError(t, err)
	assert.Equal(t, newName, p.GetName())
	assert.Equal(t, "https://new.com", p.GetLink())
}

