package user

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	userService "github.com/nnniyaz/nop/server/service/user"
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

// GetUsers godoc
//
//	@Summary		Get all users
//	@Description	Retrieves a list of all users
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Users
//	@Failure		500	{object}	response.Error
//	@Router			/api/user [get]
//	@Security		Bearer
func (hd *HttpDelivery) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewUsers(users))
}

// GetUserById godoc
//
//	@Summary		Get user by ID
//	@Description	Retrieves a single user by ID
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user_id	path		string	true	"User ID"
//	@Success		200		{object}	User
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/user/{user_id} [get]
//	@Security		Bearer
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

// CreateUser godoc
//
//	@Summary		Create a new user
//	@Description	Creates a new user with credentials
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user	body		CreateUserIn	true	"User data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/user [post]
//	@Security		Bearer
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

// UpdateUser godoc
//
//	@Summary		Update user credentials
//	@Description	Updates user's first name, last name, and role
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user	body		UpdateUserIn	true	"User update data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/user [put]
//	@Security		Bearer
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

// UpdateUserPassword godoc
//
//	@Summary		Update user password
//	@Description	Updates user's password
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			password	body		UpdateUserPasswordIn	true	"Password update data"
//	@Success		200			{object}	response.Success
//	@Failure		400			{object}	response.Error
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/user/password [put]
//	@Security		Bearer
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

// DeleteUser godoc
//
//	@Summary		Delete/disable a user
//	@Description	Soft deletes a user by marking as disabled
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user_id	path		string	true	"User ID"
//	@Success		200		{object}	response.Success
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/user/{user_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.Delete(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// RecoverUser godoc
//
//	@Summary		Recover/enable a user
//	@Description	Restores a disabled user
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user_id	path		string	true	"User ID"
//	@Success		200		{object}	response.Success
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/user/{user_id}/recover [post]
//	@Security		Bearer
func (hd *HttpDelivery) RecoverUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "user_id")
	if err := hd.service.Recover(r.Context(), userId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
