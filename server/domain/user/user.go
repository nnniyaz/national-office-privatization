package user

import (
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/user/exceptions"
	"github.com/nnniyaz/nop/domain/user/valueobject"
	"time"
)

type User struct {
	id        uuid.UUID
	firstName string
	lastName  string
	login     string
	password  valueobject.Password
	role      valueobject.Role
	disabled  bool
	createdAt time.Time
	updatedAt time.Time
}

func NewUser(firstName, lastName, login, password, role string) (*User, error) {
	if firstName == "" {
		return nil, exceptions.ErrInvalidUserFirstName
	}

	if lastName == "" {
		return nil, exceptions.ErrInvalidUserLastName
	}

	if login == "" {
		return nil, exceptions.ErrInvalidUserLogin
	}

	userPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return nil, err
	}

	userRole, err := valueobject.NewRole(role)
	if err != nil {
		return nil, err
	}

	return &User{
		id:        uuid.NewUUID(),
		firstName: firstName,
		lastName:  lastName,
		login:     login,
		password:  userPassword,
		role:      userRole,
		disabled:  false,
		createdAt: time.Now(),
		updatedAt: time.Now(),
	}, nil
}

func (u *User) GetID() uuid.UUID {
	return u.id
}

func (u *User) GetFirstName() string {
	return u.firstName
}

func (u *User) GetLastName() string {
	return u.lastName
}

func (u *User) GetLogin() string {
	return u.login
}

func (u *User) GetPassword() valueobject.Password {
	return u.password
}

func (u *User) GetRole() valueobject.Role {
	return u.role
}

func (u *User) GetDisabled() bool {
	return u.disabled
}

func (u *User) GetCreatedAt() time.Time {
	return u.createdAt
}

func (u *User) GetUpdatedAt() time.Time {
	return u.updatedAt
}

func (u *User) UpdateCredentials(firstName, lastName, role string) error {
	if firstName == "" {
		return exceptions.ErrInvalidUserFirstName
	}
	if lastName == "" {
		return exceptions.ErrInvalidUserLastName
	}
	userRole, err := valueobject.NewRole(role)
	if err != nil {
		return err
	}

	u.firstName = firstName
	u.lastName = lastName
	u.role = userRole
	u.updatedAt = time.Now()
	return nil
}

func (u *User) UpdatePassword(password string) error {
	userPassword, err := valueobject.NewPassword(password)
	if err != nil {
		return err
	}
	u.password = userPassword
	u.updatedAt = time.Now()
	return nil
}

func (u *User) Disable() {
	u.disabled = true
	u.updatedAt = time.Now()
}

func (u *User) Enable() {
	u.disabled = false
	u.updatedAt = time.Now()
}

func (u *User) ComparePassword(password string) bool {
	return u.password.Compare(password)
}

func UnmarshalUserFromDatabase(id uuid.UUID, firstName, lastName, login, role string, password valueobject.Password, disabled bool, createdAt, updatedAt time.Time) *User {
	return &User{
		id:        id,
		firstName: firstName,
		lastName:  lastName,
		login:     login,
		password:  password,
		role:      valueobject.Role(role),
		disabled:  disabled,
		createdAt: createdAt,
		updatedAt: updatedAt,
	}
}
