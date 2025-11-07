package i18n

import (
	"encoding/json"
	"errors"
	"strings"
)

type MlString struct {
	KZ string `json:"kz,omitempty" bson:"kz,omitempty"`
	RU string `json:"ru,omitempty" bson:"ru,omitempty"`
	EN string `json:"en,omitempty" bson:"en,omitempty"`
}

func (m MlString) Get(lang string) string {
	switch strings.ToLower(lang) {
	case "kz":
		if m.KZ != "" {
			return m.KZ
		}
	case "ru":
		if m.RU != "" {
			return m.RU
		}
	case "en":
		if m.EN != "" {
			return m.EN
		}
	}

	if m.KZ != "" {
		return m.KZ
	}
	if m.RU != "" {
		return m.RU
	}
	return m.EN
}

func (m *MlString) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err == nil {
		m.EN = s
		return nil
	}

	type alias MlString
	var a alias
	if err := json.Unmarshal(b, &a); err != nil {
		return err
	}

	*m = MlString(a)
	return nil
}

func (m MlString) MarshalJSON() ([]byte, error) {
	type alias MlString
	a := alias(m)
	return json.Marshal(a)
}

func (m MlString) ValidateAtLeastOne() error {
	if m.KZ == "" && m.RU == "" && m.EN == "" {
		return errors.New("MlString: at least one language must be non-empty")
	}
	return nil
}
