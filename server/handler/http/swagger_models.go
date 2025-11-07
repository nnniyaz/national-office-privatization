package http

// MlString represents a multilingual string with support for Kazakh, Russian, and English
type MlString struct {
	// Text in Kazakh
	// example: Қазақша мәтін
	KZ string `json:"kz,omitempty"`
	// Text in Russian
	// example: Русский текст
	RU string `json:"ru,omitempty"`
	// Text in English
	// example: English text
	EN string `json:"en,omitempty"`
}
