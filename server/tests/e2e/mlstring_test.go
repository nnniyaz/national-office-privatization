package e2e

import (
	"encoding/json"
	"testing"

	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/stretchr/testify/assert"
)

func TestMlString_JSONSerialization(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected i18n.MlString
	}{
		{
			name:  "object with all languages",
			input: `{"kz":"Қазақша","ru":"Русский","en":"English"}`,
			expected: i18n.MlString{
				KZ: "Қазақша",
				RU: "Русский",
				EN: "English",
			},
		},
		{
			name:  "object with partial languages",
			input: `{"ru":"Русский","en":"English"}`,
			expected: i18n.MlString{
				RU: "Русский",
				EN: "English",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var result i18n.MlString
			err := json.Unmarshal([]byte(tt.input), &result)
			assert.NoError(t, err)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestMlString_JSONSerialization_PlainStringRejected(t *testing.T) {
	var result i18n.MlString
	err := json.Unmarshal([]byte(`"Simple text"`), &result)
	assert.Error(t, err)
}

func TestMlString_Get(t *testing.T) {
	ml := i18n.MlString{
		KZ: "Қазақша",
		RU: "Русский",
		EN: "English",
	}

	tests := []struct {
		name     string
		lang     string
		expected string
	}{
		{"get kz", "kz", "Қазақша"},
		{"get ru", "ru", "Русский"},
		{"get en", "en", "English"},
		{"get KZ uppercase", "KZ", "Қазақша"},
		{"get unknown - fallback to kz", "fr", "Қазақша"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ml.Get(tt.lang)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestMlString_GetWithFallback(t *testing.T) {
	tests := []struct {
		name     string
		ml       i18n.MlString
		lang     string
		expected string
	}{
		{
			name:     "kz missing, fallback to ru",
			ml:       i18n.MlString{RU: "Русский", EN: "English"},
			lang:     "kz",
			expected: "Русский",
		},
		{
			name:     "ru missing, fallback to en",
			ml:       i18n.MlString{EN: "English"},
			lang:     "ru",
			expected: "English",
		},
		{
			name:     "all missing except en",
			ml:       i18n.MlString{EN: "English"},
			lang:     "kz",
			expected: "English",
		},
		{
			name:     "empty mlstring",
			ml:       i18n.MlString{},
			lang:     "en",
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.ml.Get(tt.lang)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestMlString_ValidateAtLeastOne(t *testing.T) {
	tests := []struct {
		name    string
		ml      i18n.MlString
		wantErr bool
	}{
		{
			name:    "all languages present",
			ml:      i18n.MlString{KZ: "Қазақша", RU: "Русский", EN: "English"},
			wantErr: false,
		},
		{
			name:    "only kz",
			ml:      i18n.MlString{KZ: "Қазақша"},
			wantErr: false,
		},
		{
			name:    "only ru",
			ml:      i18n.MlString{RU: "Русский"},
			wantErr: false,
		},
		{
			name:    "only en",
			ml:      i18n.MlString{EN: "English"},
			wantErr: false,
		},
		{
			name:    "all empty",
			ml:      i18n.MlString{},
			wantErr: true,
		},
		{
			name:    "all empty strings",
			ml:      i18n.MlString{KZ: "", RU: "", EN: ""},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.ml.ValidateAtLeastOne()
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestMlString_MarshalJSON(t *testing.T) {
	ml := i18n.MlString{
		KZ: "Қазақша",
		RU: "Русский",
		EN: "English",
	}

	data, err := json.Marshal(ml)
	assert.NoError(t, err)

	// Verify it's a proper JSON object
	var result map[string]string
	err = json.Unmarshal(data, &result)
	assert.NoError(t, err)
	assert.Equal(t, "Қазақша", result["kz"])
	assert.Equal(t, "Русский", result["ru"])
	assert.Equal(t, "English", result["en"])
}

func TestMlString_RoundTrip(t *testing.T) {
	original := i18n.MlString{
		KZ: "Қазақша мәтін",
		RU: "Русский текст",
		EN: "English text",
	}

	// Marshal to JSON
	data, err := json.Marshal(original)
	assert.NoError(t, err)

	// Unmarshal back
	var result i18n.MlString
	err = json.Unmarshal(data, &result)
	assert.NoError(t, err)

	assert.Equal(t, original, result)
}
