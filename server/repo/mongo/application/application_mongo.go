package application

import (
	"context"
	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoApplication struct {
	client *mongo.Client
}

func NewRepoApplication(client *mongo.Client) *RepoApplication {
	return &RepoApplication{client: client}
}

func (r *RepoApplication) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("application")
}

type mongoApplication struct {
	Id           uuid.UUID `bson:"_id"`
	EnterpriseId string    `bson:"enterpriseId"`
	Fio          string    `bson:"fio"`
	Bin          string    `bson:"bin"`
	Contact      string    `bson:"contact"`
	Message      string    `bson:"message"`
	CreateAt     time.Time `bson:"createAt"`
}

func newFromApplication(a *application.Application) *mongoApplication {
	return &mongoApplication{
		Id:           a.GetID(),
		EnterpriseId: a.GetEnterpriseId(),
		Fio:          a.GetFio(),
		Bin:          a.GetBin(),
		Contact:      a.GetContact(),
		Message:      a.GetMessage(),
		CreateAt:     a.GetCreatedAt(),
	}
}

func (m *mongoApplication) ToAggregate() *application.Application {
	return application.UnmarshalApplicationFromDatabase(m.Id, m.EnterpriseId, m.Fio, m.Bin, m.Contact, m.Message, m.CreateAt)
}

func (r *RepoApplication) Get(ctx context.Context) ([]*application.Application, error) {
	cursor, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var applications []*application.Application
	for cursor.Next(ctx) {
		var a mongoApplication
		if err := cursor.Decode(&a); err != nil {
			return nil, err
		}
		applications = append(applications, a.ToAggregate())
	}

	return applications, nil
}

func (r *RepoApplication) GetById(ctx context.Context, id uuid.UUID) (*application.Application, error) {
	var a mongoApplication
	if err := r.Coll().FindOne(ctx, map[string]uuid.UUID{"_id": id}).Decode(&a); err != nil {
		return nil, err
	}
	return a.ToAggregate(), nil
}

func (r *RepoApplication) Create(ctx context.Context, a *application.Application) error {
	_, err := r.Coll().InsertOne(ctx, newFromApplication(a))
	return err
}

func (r *RepoApplication) Update(ctx context.Context, a *application.Application) error {
	_, err := r.Coll().UpdateOne(ctx, map[string]uuid.UUID{"_id": a.GetID()}, map[string]interface{}{"$set": newFromApplication(a)})
	return err
}

func (r *RepoApplication) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, map[string]uuid.UUID{"_id": id})
	return err
}
