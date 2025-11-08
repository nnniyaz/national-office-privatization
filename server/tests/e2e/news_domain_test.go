package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/news"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNews_NewNews_Success(t *testing.T) {
	title := i18n.MlString{
		KZ: "Жаңалық тақырыбы",
		RU: "Заголовок новости",
		EN: "News Title",
	}
	content := i18n.MlString{
		KZ: "Мазмұн",
		RU: "Содержание новости",
		EN: "News content",
	}

	n, err := news.NewNews(title, content, "/images/news.jpg")

	require.NoError(t, err)
	assert.NotNil(t, n)
	assert.Equal(t, title, n.GetTitle())
	assert.Equal(t, content, n.GetContent())
	assert.Equal(t, "/images/news.jpg", n.GetImgUrl())
}

func TestNews_NewNews_EmptyTitle_ShouldFail(t *testing.T) {
	emptyTitle := i18n.MlString{}
	content := i18n.MlString{EN: "Content"}

	n, err := news.NewNews(emptyTitle, content, "")

	assert.Error(t, err)
	assert.Nil(t, n)
}

func TestNews_NewNews_EmptyContent_ShouldFail(t *testing.T) {
	title := i18n.MlString{EN: "Title"}
	emptyContent := i18n.MlString{}

	n, err := news.NewNews(title, emptyContent, "")

	assert.Error(t, err)
	assert.Nil(t, n)
}

func TestNews_Update_Success(t *testing.T) {
	oldTitle := i18n.MlString{EN: "Old Title"}
	oldContent := i18n.MlString{EN: "Old Content"}
	n, err := news.NewNews(oldTitle, oldContent, "")
	require.NoError(t, err)

	newTitle := i18n.MlString{
		KZ: "Жаңа тақырып",
		RU: "Новый заголовок",
		EN: "New Title",
	}
	newContent := i18n.MlString{
		KZ: "Жаңа мазмұн",
		RU: "Новое содержание",
		EN: "New Content",
	}

	err = n.Update(newTitle, newContent, "/new/image.jpg")

	assert.NoError(t, err)
	assert.Equal(t, newTitle, n.GetTitle())
	assert.Equal(t, newContent, n.GetContent())
	assert.Equal(t, "/new/image.jpg", n.GetImgUrl())
}

func TestNews_MultilingualContent(t *testing.T) {
	title := i18n.MlString{
		KZ: "Қазақша тақырып",
		RU: "Русский заголовок",
		EN: "English Title",
	}
	content := i18n.MlString{
		KZ: "Толық мазмұны қазақша",
		RU: "Полное содержание на русском",
		EN: "Full content in English",
	}

	n, err := news.NewNews(title, content, "")
	require.NoError(t, err)

	// Verify all languages are preserved
	assert.Equal(t, "Қазақша тақырып", n.GetTitle().Get("kz"))
	assert.Equal(t, "Русский заголовок", n.GetTitle().Get("ru"))
	assert.Equal(t, "English Title", n.GetTitle().Get("en"))

	assert.Equal(t, "Толық мазмұны қазақша", n.GetContent().Get("kz"))
	assert.Equal(t, "Полное содержание на русском", n.GetContent().Get("ru"))
	assert.Equal(t, "Full content in English", n.GetContent().Get("en"))
}

