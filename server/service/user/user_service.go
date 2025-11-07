package user

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/domain/user/exceptions"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type UserService interface {
	Get(ctx context.Context) ([]*user.User, error)
	GetByID(ctx context.Context, userId string) (*user.User, error)
	GetByLogin(ctx context.Context, login string) (*user.User, error)
	Create(ctx context.Context, firstName, lastName, login, password, role string) error
	UpdateCredentials(ctx context.Context, userId, firstName, lastName, role string) error
	UpdatePassword(ctx context.Context, userId, password string) error
	Delete(ctx context.Context, userId string) error
	Recover(ctx context.Context, userId string) error
}

type userService struct {
	logger logger.Logger
	repo   repo.User
}

func NewUserService(logger logger.Logger, repo repo.User) UserService {
	return &userService{logger: logger, repo: repo}
}

func (s *userService) Get(ctx context.Context) ([]*user.User, error) {
	return s.repo.Get(ctx)
}

func (s *userService) GetByID(ctx context.Context, userId string) (*user.User, error) {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	return s.repo.GetById(ctx, convertedUserId)
}

func (s *userService) GetByLogin(ctx context.Context, login string) (*user.User, error) {
	return s.repo.GetByLogin(ctx, login)
}

func (s *userService) Create(ctx context.Context, firstName, lastName, login, password, role string) error {
	foundUser, err := s.repo.GetByLogin(ctx, login)
	if err != nil {
		return err
	}
	if foundUser != nil {
		return exceptions.ErrUserAlreadyExistsWithThisLogin
	}

	newUser, err := user.NewUser(firstName, lastName, login, password, role)
	if err != nil {
		return nil
	}

	return s.repo.Create(ctx, newUser)
}

func (s *userService) UpdateCredentials(ctx context.Context, userId, firstName, lastName, role string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}

	foundUser, err := s.repo.GetById(ctx, convertedUserId)
	if err != nil {
		return err
	}

	if foundUser == nil {
		return exceptions.ErrUserNotFound
	}

	err = foundUser.UpdateCredentials(firstName, lastName, role)
	if err != nil {
		return err
	}

	return s.repo.Update(ctx, foundUser)
}

func (s *userService) UpdatePassword(ctx context.Context, userId, password string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}

	foundUser, err := s.repo.GetById(ctx, convertedUserId)
	if err != nil {
		return err
	}

	if foundUser == nil {
		return exceptions.ErrUserNotFound
	}

	err = foundUser.UpdatePassword(password)
	if err != nil {
		return err
	}

	return s.repo.Update(ctx, foundUser)
}

func (s *userService) Delete(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, convertedUserId)
}

func (s *userService) Recover(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.repo.Recover(ctx, convertedUserId)
}
