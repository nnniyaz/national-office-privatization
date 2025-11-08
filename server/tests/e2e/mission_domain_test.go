package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/mission"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestMission_NewMission_Success(t *testing.T) {
	text := i18n.MlString{
		KZ: "Біздің миссия - инновацияларды дамыту",
		RU: "Наша миссия - развитие инноваций",
		EN: "Our mission is to develop innovations",
	}

	m, err := mission.NewMission(text)

	require.NoError(t, err)
	assert.NotNil(t, m)
	assert.Equal(t, text, m.GetText())
}

func TestMission_NewMission_EmptyText_ShouldFail(t *testing.T) {
	emptyText := i18n.MlString{}

	m, err := mission.NewMission(emptyText)

	assert.Error(t, err)
	assert.Nil(t, m)
}

func TestMission_Update_Success(t *testing.T) {
	oldText := i18n.MlString{EN: "Old Mission"}
	m, err := mission.NewMission(oldText)
	require.NoError(t, err)

	newText := i18n.MlString{
		KZ: "Жаңа миссия",
		RU: "Новая миссия",
		EN: "New Mission",
	}

	err = m.Update(newText)

	assert.NoError(t, err)
	assert.Equal(t, newText, m.GetText())
}

func TestMission_Update_EmptyText_ShouldFail(t *testing.T) {
	text := i18n.MlString{EN: "Mission"}
	m, err := mission.NewMission(text)
	require.NoError(t, err)

	emptyText := i18n.MlString{}

	err = m.Update(emptyText)

	assert.Error(t, err)
}

func TestMission_PartialLanguages(t *testing.T) {
	// Only Kazakh
	text := i18n.MlString{KZ: "Қазақша ғана"}
	m, err := mission.NewMission(text)
	require.NoError(t, err)

	// Fallback should work
	assert.Equal(t, "Қазақша ғана", m.GetText().Get("ru")) // ru not available, falls back to kz
	assert.Equal(t, "Қазақша ғана", m.GetText().Get("en")) // en not available, falls back to kz
}

