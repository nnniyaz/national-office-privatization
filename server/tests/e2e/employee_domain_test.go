package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEmployee_NewEmployee_Success(t *testing.T) {
	name := i18n.MlString{
		KZ: "Қызметкер аты",
		RU: "Имя сотрудника",
		EN: "Employee Name",
	}

	e, err := employee.NewEmployee(name, "Менеджмент")

	require.NoError(t, err)
	assert.NotNil(t, e)
	assert.Equal(t, name, e.GetName())
	assert.Equal(t, "Менеджмент", e.GetGroup())
}

func TestEmployee_NewEmployee_EmptyName_ShouldFail(t *testing.T) {
	emptyName := i18n.MlString{}

	e, err := employee.NewEmployee(emptyName, "Группа")

	assert.Error(t, err)
	assert.Nil(t, e)
}

func TestEmployee_Update_Success(t *testing.T) {
	oldName := i18n.MlString{EN: "Old Name"}
	e, err := employee.NewEmployee(oldName, "Old Group")
	require.NoError(t, err)

	newName := i18n.MlString{
		KZ: "Жаңа ат",
		RU: "Новое имя",
		EN: "New Name",
	}

	err = e.Update(newName, "New Group")

	assert.NoError(t, err)
	assert.Equal(t, newName, e.GetName())
	assert.Equal(t, "New Group", e.GetGroup())
}

func TestEmployee_Update_EmptyName_ShouldFail(t *testing.T) {
	name := i18n.MlString{EN: "Name"}
	e, err := employee.NewEmployee(name, "Group")
	require.NoError(t, err)

	emptyName := i18n.MlString{}

	err = e.Update(emptyName, "Group")

	assert.Error(t, err)
}

