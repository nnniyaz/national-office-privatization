package e2e

import (
	"testing"
	"time"

	"github.com/nnniyaz/nop/server/domain/event"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEvent_NewEvent_WithMlString(t *testing.T) {
	name := i18n.MlString{
		KZ: "Оқиға атауы",
		RU: "Название события",
		EN: "Event Name",
	}
	desc := i18n.MlString{
		KZ: "Сипаттама",
		RU: "Описание",
		EN: "Description",
	}
	planned := time.Now().Add(24 * time.Hour)

	e, err := event.NewEvent(name, desc, "/images/event.jpg", planned)

	require.NoError(t, err)
	assert.NotNil(t, e)
	assert.Equal(t, name, e.GetName())
	assert.Equal(t, desc, e.GetDesc())
	assert.Equal(t, "/images/event.jpg", e.GetImgUrl())
	assert.Equal(t, planned.Unix(), e.GetPlannedAt().Unix())
}

func TestEvent_NewEvent_EmptyName_ShouldFail(t *testing.T) {
	emptyName := i18n.MlString{} // All languages empty
	desc := i18n.MlString{EN: "Description"}
	planned := time.Now()

	e, err := event.NewEvent(emptyName, desc, "", planned)

	assert.Error(t, err)
	assert.Nil(t, e)
}

func TestEvent_Update_Success(t *testing.T) {
	oldName := i18n.MlString{EN: "Old Name"}
	oldDesc := i18n.MlString{EN: "Old Desc"}
	e, err := event.NewEvent(oldName, oldDesc, "", time.Now())
	require.NoError(t, err)

	newName := i18n.MlString{
		KZ: "Жаңа атау",
		RU: "Новое название",
		EN: "New Name",
	}
	newDesc := i18n.MlString{
		KZ: "Жаңа сипаттама",
		RU: "Новое описание",
		EN: "New Description",
	}
	newPlanned := time.Now().Add(48 * time.Hour)

	err = e.Update(newName, newDesc, "/new/image.jpg", newPlanned)

	assert.NoError(t, err)
	assert.Equal(t, newName, e.GetName())
	assert.Equal(t, newDesc, e.GetDesc())
	assert.Equal(t, "/new/image.jpg", e.GetImgUrl())
	assert.Equal(t, newPlanned.Unix(), e.GetPlannedAt().Unix())
}

func TestEvent_GetMethods(t *testing.T) {
	name := i18n.MlString{
		KZ: "Қазақша",
		RU: "Русский",
		EN: "English",
	}
	desc := i18n.MlString{EN: "Description"}
	planned := time.Date(2025, 12, 31, 10, 0, 0, 0, time.UTC)

	e, err := event.NewEvent(name, desc, "/test.jpg", planned)
	require.NoError(t, err)

	// Test language getter
	assert.Equal(t, "Қазақша", e.GetName().Get("kz"))
	assert.Equal(t, "Русский", e.GetName().Get("ru"))
	assert.Equal(t, "English", e.GetName().Get("en"))

	// Fallback test
	assert.Equal(t, "Қазақша", e.GetName().Get("unknown"))
}

