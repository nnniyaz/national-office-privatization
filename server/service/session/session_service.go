package session

import (
	"context"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/session"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type SessionService interface {
	GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error)
	GetOneBySession(ctx context.Context, session string) (*session.Session, error)
	Create(ctx context.Context, session *session.Session) error
	UpdateLastActionAt(ctx context.Context, session string) error
	DeleteAllSessionsByUserId(ctx context.Context, userId string) error
	DeleteOneBySessionId(ctx context.Context, id string) error
	DeleteOneByToken(ctx context.Context, token string) error
}

type sessionService struct {
	logger      logger.Logger
	sessionRepo repo.Session
}

func NewSessionService(l logger.Logger, repo repo.Session) SessionService {
	return &sessionService{logger: l, sessionRepo: repo}
}

func (s *sessionService) GetAllByUserId(ctx context.Context, userId string) ([]*session.Session, error) {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return nil, err
	}
	sessions, err := s.sessionRepo.FindManyByUserId(ctx, convertedUserId)
	if err != nil {
		return nil, err
	}
	return sessions, nil
}

func (s *sessionService) GetOneBySession(ctx context.Context, session string) (*session.Session, error) {
	convertedToken, err := uuid.UUIDFromString(session)
	if err != nil {
		return nil, err
	}
	return s.sessionRepo.FindOneBySession(ctx, convertedToken)
}

func (s *sessionService) Create(ctx context.Context, session *session.Session) error {
	return s.sessionRepo.Create(ctx, session)
}

func (s *sessionService) UpdateLastActionAt(ctx context.Context, sessionId string) error {
	convertedSession, err := uuid.UUIDFromString(sessionId)
	if err != nil {
		return err
	}
	return s.sessionRepo.UpdateLastActionAt(ctx, convertedSession)
}

func (s *sessionService) DeleteAllSessionsByUserId(ctx context.Context, userId string) error {
	convertedUserId, err := uuid.UUIDFromString(userId)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteAllByUserId(ctx, convertedUserId)
}

func (s *sessionService) DeleteOneBySessionId(ctx context.Context, sessionId string) error {
	convertedSessionId, err := uuid.UUIDFromString(sessionId)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteById(ctx, convertedSessionId)
}

func (s *sessionService) DeleteOneByToken(ctx context.Context, token string) error {
	convertedToken, err := uuid.UUIDFromString(token)
	if err != nil {
		return err
	}
	return s.sessionRepo.DeleteByToken(ctx, convertedToken)
}
