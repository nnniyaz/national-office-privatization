package application

import (
	"context"
	"time"

	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	Phone        string    `bson:"phone"`
	Email        string    `bson:"email"`
	Message      string    `bson:"message"`
	CreateAt     time.Time `bson:"createAt"`
	UpdatedAt    time.Time `bson:"updatedAt,omitempty"`
}

func newFromApplication(a *application.Application) *mongoApplication {
	return &mongoApplication{
		Id:           a.GetID(),
		EnterpriseId: a.GetEnterpriseId(),
		Fio:          a.GetFio(),
		Bin:          a.GetBin(),
		Phone:        a.GetPhone(),
		Email:        a.GetEmail(),
		Message:      a.GetMessage(),
		CreateAt:     a.GetCreatedAt(),
		UpdatedAt:    a.GetUpdatedAt(),
	}
}

func (m *mongoApplication) ToAggregate() *application.Application {
	// у легаси-документов updatedAt отсутствует — берём дату создания
	updatedAt := m.UpdatedAt
	if updatedAt.IsZero() {
		updatedAt = m.CreateAt
	}
	return application.UnmarshalApplicationFromDatabase(m.Id, m.EnterpriseId, m.Fio, m.Bin, m.Phone, m.Email, m.Message, m.CreateAt, updatedAt)
}

func (r *RepoApplication) Get(ctx context.Context) ([]*application.Application, error) {
	var m []mongoApplication
	cursor, err := r.Coll().Find(ctx, bson.D{}, options.Find().SetSort(bson.D{bson.E{Key: "createAt", Value: -1}}))
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, err
	}
	var applications []*application.Application
	for _, v := range m {
		applications = append(applications, v.ToAggregate())
	}
	return applications, nil
}

func (r *RepoApplication) GetByPeriod(ctx context.Context, from, to *time.Time) ([]*application.Application, error) {
	createAt := bson.M{}
	if from != nil {
		createAt["$gte"] = *from
	}
	if to != nil {
		createAt["$lte"] = *to
	}
	filter := bson.M{}
	if len(createAt) > 0 {
		filter["createAt"] = createAt
	}

	var m []mongoApplication
	cursor, err := r.Coll().Find(ctx, filter, options.Find().SetSort(bson.D{bson.E{Key: "createAt", Value: 1}}))
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, err
	}
	var applications []*application.Application
	for _, v := range m {
		applications = append(applications, v.ToAggregate())
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
