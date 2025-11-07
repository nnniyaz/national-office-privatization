package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	"github.com/nnniyaz/nop/server/service/auth"
)

type HttpDelivery struct {
	logger  logger.Logger
	service auth.AuthService
}

func NewHttpDelivery(l logger.Logger, service auth.AuthService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type User struct {
	Id        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Login     string `json:"login"`
	Role      string `json:"role"`
	Disabled  bool   `json:"disabled"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

func newUser(u *user.User) *User {
	return &User{
		Id:        u.GetID().String(),
		FirstName: u.GetFirstName(),
		LastName:  u.GetLastName(),
		Login:     u.GetLogin(),
		Role:      u.GetRole().String(),
		Disabled:  u.GetDisabled(),
		CreatedAt: u.GetCreatedAt().Format(time.RFC3339),
		UpdatedAt: u.GetUpdatedAt().Format(time.RFC3339),
	}
}

// GetCurrentUser godoc
// @Summary Get current authenticated user
// @Description Returns the currently logged in user's information
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} User
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/auth/me [get]
// @Security Bearer
func (hd *HttpDelivery) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(user.User)
	response.NewSuccess(hd.logger, w, r, newUser(&u))
}

type LoginIn struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

// Login godoc
// @Summary User login
// @Description Authenticates a user and returns a session cookie
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body LoginIn true "Login credentials"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/auth/login [post]
func (hd *HttpDelivery) Login(w http.ResponseWriter, r *http.Request) {
	requestInfo := r.Context().Value("requestInfo").(web.RequestInfo)

	in := LoginIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	token, err := hd.service.Login(r.Context(), in.Login, in.Password, requestInfo.UserAgent.String)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "nop-app-session",
		Value:    token.String(),
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	response.NewSuccess(hd.logger, w, r, nil)
}

// Logout godoc
// @Summary User logout
// @Description Logs out the current user and clears the session cookie
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/auth/logout [post]
// @Security Bearer
func (hd *HttpDelivery) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("nop-app-session")
	if err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err = hd.service.Logout(r.Context(), cookie.Value); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "nop-app-session",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	response.NewSuccess(hd.logger, w, r, nil)
}
