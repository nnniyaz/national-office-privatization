package event

import (
	"context"
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/event"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoEvent struct {
	client *mongo.Client
}

func NewRepoEvent(client *mongo.Client) *RepoEvent {
	return &RepoEvent{client: client}
}

func (r *RepoEvent) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("event")
}

type mongoEvent struct {
	Id        uuid.UUID     `bson:"_id"`
	Name      i18n.MlString `bson:"name"`
	Desc      i18n.MlString `bson:"desc"`
	ImgUrl    string        `bson:"imgUrl"`
	PlannedAt time.Time     `bson:"plannedAt"`
	CreatedAt time.Time     `bson:"createdAt"`
	UpdatedAt time.Time     `bson:"updatedAt"`
}

func newFromEvent(e *event.Event) *mongoEvent {
	return &mongoEvent{
		Id:        e.GetID(),
		Name:      e.GetName(),
		Desc:      e.GetDesc(),
		ImgUrl:    e.GetImgUrl(),
		PlannedAt: e.GetPlannedAt(),
		CreatedAt: e.GetCreatedAt(),
		UpdatedAt: e.GetUpdatedAt(),
	}
}

func (m *mongoEvent) ToAggregate() *event.Event {
	return event.UnmarshalEventFromDatabase(m.Id, m.Name, m.Desc, m.ImgUrl, m.PlannedAt, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoEvent) Get(ctx context.Context) ([]*event.Event, error) {
	var m []mongoEvent
	cursor, err := r.Coll().Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, err
	}
	var events []*event.Event
	for _, v := range m {
		events = append(events, v.ToAggregate())
	}
	return events, nil
}

func (r *RepoEvent) GetById(ctx context.Context, id uuid.UUID) (*event.Event, error) {
	var m mongoEvent
	if err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&m); err != nil {
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoEvent) Create(ctx context.Context, e *event.Event) error {
	_, err := r.Coll().InsertOne(ctx, newFromEvent(e))
	return err
}

func (r *RepoEvent) Update(ctx context.Context, e *event.Event) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": e.GetID()}, bson.M{"$set": newFromEvent(e)})
	return err
}

func (r *RepoEvent) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
