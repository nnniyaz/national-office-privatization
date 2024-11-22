package user

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	userService "github.com/nnniyaz/nop/server/service/user"
	"net/http"
	"time"
)

type HttpDelivery struct {
	logger  logger.Logger
	service userService.UserService
}

func NewHttpDelivery(l logger.Logger, service userService.UserService) *HttpDelivery {
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

func NewUser(u *user.User) *User {
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

type Users struct {
	Users []*User `json:"users"`
	Count int     `json:"count"`
}

func NewUsers(users []*user.User) *Users {
	var usersList []*User
	for _, u := range users {
		usersList = append(usersList, NewUser(u))
	}
	return &Users{
		Users: usersList,
		Count: len(users),
	}
}

func (hd *HttpDelivery) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewUsers(users))
}

func (hd *HttpDelivery) GetUserById(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	u, err := hd.service.GetByID(r.Context(), userId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewUser(u))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateUserIn struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Login     string `json:"login"`
	Password  string `json:"password"`
	Role      string `json:"role"`
}

func (hd *HttpDelivery) CreateUser(w http.ResponseWriter, r *http.Request) {
	in := CreateUserIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.FirstName, in.LastName, in.Login, in.Password, in.Role); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserIn struct {
	Id        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Role      string `json:"role"`
}

func (hd *HttpDelivery) UpdateUser(w http.ResponseWriter, r *http.Request) {
	in := UpdateUserIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdateCredentials(r.Context(), in.Id, in.FirstName, in.LastName, in.Role); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateUserPasswordIn struct {
	Id       string `json:"id"`
	Password string `json:"password"`
}

func (hd *HttpDelivery) UpdateUserPassword(w http.ResponseWriter, r *http.Request) {
	in := UpdateUserPasswordIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.UpdatePassword(r.Context(), in.Id, in.Password); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.Delete(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) RecoverUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.Recover(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
