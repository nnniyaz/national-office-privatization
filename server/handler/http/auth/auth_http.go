package auth

import (
	"encoding/json"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/pkg/web"
	"github.com/nnniyaz/nop/server/service/auth"
	"net/http"
	"time"
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

func (hd *HttpDelivery) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(user.User)
	response.NewSuccess(hd.logger, w, r, newUser(&u))
}

type LoginIn struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

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
