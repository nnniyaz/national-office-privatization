package mission

import (
	"context"
	"errors"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/mission"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoMission struct {
	client *mongo.Client
}

func NewRepoMission(client *mongo.Client) *RepoMission {
	return &RepoMission{client: client}
}

func (r *RepoMission) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("mission")
}

type mongoMission struct {
	Id   uuid.UUID `bson:"_id"`
	Text string    `bson:"text"`
}

func newFromMission(m *mission.Mission) *mongoMission {
	return &mongoMission{
		Id:   m.GetID(),
		Text: m.GetText(),
	}
}

func (m *mongoMission) ToAggregate() *mission.Mission {
	return mission.UnmarshalMissionFromDatabase(m.Id, m.Text)
}

func (r *RepoMission) Get(ctx context.Context) (*mission.Mission, error) {
	var m mongoMission
	err := r.Coll().FindOne(ctx, bson.M{}).Decode(&m)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoMission) Create(ctx context.Context, m *mission.Mission) error {
	_, err := r.Coll().InsertOne(ctx, newFromMission(m))
	return err
}

func (r *RepoMission) Update(ctx context.Context, m *mission.Mission) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": m.GetID()}, bson.M{"$set": newFromMission(m)})
	return err
}
