package http

// MlString represents a multilingual string with support for Kazakh, Russian, and English
// swagger:model
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

// SuccessResponse represents a successful API response
// swagger:model
type SuccessResponse struct {
	// Success flag
	// example: true
	Success bool `json:"success"`
	// Response data
	Data interface{} `json:"data,omitempty"`
}

// ErrorResponse represents an error API response
// swagger:model
type ErrorResponse struct {
	// Success flag
	// example: false
	Success bool `json:"success"`
	// Error message
	// example: Invalid request
	Error string `json:"error"`
}

