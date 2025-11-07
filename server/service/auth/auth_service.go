package auth

import (
	"context"
	"sort"

	"github.com/nnniyaz/nop/server/config"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/session"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/domain/user/exceptions"
	"github.com/nnniyaz/nop/server/pkg/core"
	"github.com/nnniyaz/nop/server/pkg/logger"
	sessionService "github.com/nnniyaz/nop/server/service/session"
	userService "github.com/nnniyaz/nop/server/service/user"
	"go.uber.org/zap"
)

const maxSessionsCount = 5

var ErrUnauthorized = core.NewI18NError(core.EUNAUTHORIZED, core.TXT_UNAUTHORIZED)

type AuthService interface {
	Login(ctx context.Context, email, password, userAgent string) (uuid.UUID, error)
	Logout(ctx context.Context, session string) error
	UserCheck(ctx context.Context, session string, userAgent string) (*user.User, error)
}

type authService struct {
	logger         logger.Logger
	config         *config.Config
	userService    userService.UserService
	sessionService sessionService.SessionService
}

func NewAuthService(l logger.Logger, config *config.Config, userService userService.UserService, sessionService sessionService.SessionService) AuthService {
	return &authService{logger: l, config: config, userService: userService, sessionService: sessionService}
}

func (a *authService) Login(ctx context.Context, login, password, userAgent string) (uuid.UUID, error) {
	u, err := a.userService.GetByLogin(ctx, login)
	if err != nil {
		return uuid.Nil, exceptions.ErrUserNotFound
	}

	if u == nil || u.GetDisabled() {
		return uuid.Nil, exceptions.ErrUserNotFound
	}

	ok := u.ComparePassword(password)
	if !ok {
		return uuid.Nil, exceptions.ErrInvalidUserPassword
	}

	sessions, err := a.sessionService.GetAllByUserId(ctx, u.GetID().String())
	if err != nil {
		return uuid.Nil, err
	}

	if len(sessions) >= maxSessionsCount {
		sort.Slice(sessions, func(i, j int) bool {
			return sessions[i].GetCreatedAt().Before(sessions[j].GetCreatedAt())
		})

		for i := 0; i < len(sessions)-maxSessionsCount+1; i++ {
			if err = a.sessionService.DeleteOneBySessionId(ctx, sessions[i].GetId().String()); err != nil {
				return uuid.Nil, err
			}
		}
	}

	newSession, err := session.NewSession(u.GetID(), userAgent)
	if err = a.sessionService.Create(ctx, newSession); err != nil {
		return uuid.Nil, err
	}
	return newSession.GetSession(), nil
}

func (a *authService) Logout(ctx context.Context, token string) error {
	return a.sessionService.DeleteOneByToken(ctx, token)
}

func (a *authService) UserCheck(ctx context.Context, key string, userAgent string) (*user.User, error) {
	userSession, err := a.sessionService.GetOneBySession(ctx, key)
	if userSession == nil {
		return nil, ErrUnauthorized
	}
	if err != nil {
		return nil, err
	}

	if userSession.GetUserAgent().String() != userAgent {
		if err = a.sessionService.DeleteOneByToken(ctx, key); err != nil {
			a.logger.Error("failed to delete user session", zap.Error(err))
		}
		return nil, ErrUnauthorized
	}
	if err = a.sessionService.UpdateLastActionAt(ctx, userSession.GetId().String()); err != nil {
		return nil, err
	}
	return a.userService.GetByID(ctx, userSession.GetUserId().String())
}
