package session

import (
	"context"
	"errors"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/session"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoSession struct {
	client *mongo.Client
}

func NewRepoSession(client *mongo.Client) *RepoSession {
	return &RepoSession{client: client}
}

func (r *RepoSession) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("sessions")
}

type mongoSession struct {
	Id        uuid.UUID `bson:"_id"`
	UserID    uuid.UUID `bson:"userId"`
	Session   uuid.UUID `bson:"session"`
	UserAgent string    `bson:"userAgent"`
	CreatedAt time.Time `bson:"createdAt"`
}

func newFromSession(s *session.Session) *mongoSession {
	return &mongoSession{
		Id:        s.GetId(),
		UserID:    s.GetUserId(),
		Session:   s.GetSession(),
		UserAgent: s.GetUserAgent().String(),
		CreatedAt: s.GetCreatedAt(),
	}
}

func (m *mongoSession) ToAggregate() *session.Session {
	return session.UnmarshalSessionFromDatabase(m.Id, m.UserID, m.Session, m.UserAgent, m.CreatedAt)
}

func (r *RepoSession) FindManyByUserId(ctx context.Context, userId uuid.UUID) ([]*session.Session, error) {
	cur, err := r.Coll().Find(ctx, bson.M{"userId": userId})
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	defer cur.Close(ctx)

	var sessions []*session.Session
	for cur.Next(ctx) {
		var s mongoSession
		if err = cur.Decode(&s); err != nil {
			return nil, err
		}
		sessions = append(sessions, s.ToAggregate())
	}
	return sessions, nil
}

func (r *RepoSession) FindOneBySession(ctx context.Context, session uuid.UUID) (*session.Session, error) {
	var s mongoSession
	if err := r.Coll().FindOne(ctx, bson.M{"session": session}).Decode(&s); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return s.ToAggregate(), nil
}

func (r *RepoSession) Create(ctx context.Context, session *session.Session) error {
	_, err := r.Coll().InsertOne(ctx, newFromSession(session))
	return err
}

func (r *RepoSession) UpdateLastActionAt(ctx context.Context, sessionId uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": sessionId,
	}, bson.M{
		"$set": bson.M{
			"lastActionAt": time.Now(),
		},
	})
	return err
}

func (r *RepoSession) DeleteAllByUserId(ctx context.Context, userId uuid.UUID) error {
	_, err := r.Coll().DeleteMany(ctx, bson.M{"userId": userId})
	return err
}

func (r *RepoSession) DeleteById(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *RepoSession) DeleteByToken(ctx context.Context, token uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"session": token})
	return err
}
