package valueobject

import "github.com/nnniyaz/nop/server/domain/user/exceptions"

const (
	RoleAdmin = "admin"
	RoleUser  = "user"
)

type Role string

func NewRole(role string) (Role, error) {
	if role == RoleAdmin {
		return RoleAdmin, nil
	} else if role == RoleUser {
		return RoleUser, nil
	}
	return "", exceptions.ErrInvalidUserRole
}

func (r Role) String() string {
	return string(r)
}
