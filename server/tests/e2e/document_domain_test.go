package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/document"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDocument_NewDocument_Success(t *testing.T) {
	title := i18n.MlString{
		KZ: "Құжат атауы",
		RU: "Название документа",
		EN: "Document Title",
	}

	d, err := document.NewDocument(title, "document.pdf")

	require.NoError(t, err)
	assert.NotNil(t, d)
	assert.Equal(t, title, d.GetTitle())
	assert.Equal(t, "document.pdf", d.GetFilename())
}

func TestDocument_NewDocument_EmptyTitle_ShouldFail(t *testing.T) {
	emptyTitle := i18n.MlString{}

	d, err := document.NewDocument(emptyTitle, "file.pdf")

	assert.Error(t, err)
	assert.Nil(t, d)
}

func TestDocument_NewDocument_EmptyFilename_ShouldFail(t *testing.T) {
	title := i18n.MlString{EN: "Title"}

	d, err := document.NewDocument(title, "")

	assert.Error(t, err)
	assert.Nil(t, d)
}

func TestDocument_Update_Success(t *testing.T) {
	oldTitle := i18n.MlString{EN: "Old Title"}
	d, err := document.NewDocument(oldTitle, "old.pdf")
	require.NoError(t, err)

	newTitle := i18n.MlString{
		KZ: "Жаңа атау",
		RU: "Новое название",
		EN: "New Title",
	}

	err = d.Update(newTitle, "new.pdf")

	assert.NoError(t, err)
	assert.Equal(t, newTitle, d.GetTitle())
	assert.Equal(t, "new.pdf", d.GetFilename())
}

func TestDocument_Update_EmptyTitle_ShouldFail(t *testing.T) {
	title := i18n.MlString{EN: "Title"}
	d, err := document.NewDocument(title, "file.pdf")
	require.NoError(t, err)
	require.NotNil(t, d)

	emptyTitle := i18n.MlString{}

	err = d.Update(emptyTitle, "file.pdf")

	assert.Error(t, err)
}

func TestDocument_Update_EmptyFilename_ShouldFail(t *testing.T) {
	title := i18n.MlString{EN: "Title"}
	d, err := document.NewDocument(title, "file.pdf")
	require.NoError(t, err)
	require.NotNil(t, d)

	err = d.Update(title, "")

	assert.Error(t, err)
}
