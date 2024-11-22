package npa

import (
	"context"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/npa"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type RepoNpa struct {
	client *mongo.Client
}

func NewRepoNpa(client *mongo.Client) *RepoNpa {
	return &RepoNpa{client: client}
}

func (r *RepoNpa) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("npa")
}

type mongoNpa struct {
	Id        uuid.UUID `bson:"_id"`
	Title     string    `bson:"title"`
	Filename  string    `bson:"filename"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromNpa(d *npa.Npa) *mongoNpa {
	return &mongoNpa{
		Id:        d.GetID(),
		Title:     d.GetTitle(),
		Filename:  d.GetFilename(),
		CreatedAt: d.GetCreatedAt(),
		UpdatedAt: d.GetUpdatedAt(),
	}
}

func (m *mongoNpa) ToAggregate() *npa.Npa {
	return npa.UnmarshalNpaFromDatabase(m.Id, m.Title, m.Filename, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoNpa) Get(ctx context.Context) ([]*npa.Npa, error) {
	cursor, err := r.Coll().Find(ctx, bson.D{}, options.Find().SetSort(bson.D{{"createdAt", -1}}))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var npas []*npa.Npa
	for cursor.Next(ctx) {
		var d mongoNpa
		if err := cursor.Decode(&d); err != nil {
			return nil, err
		}
		npas = append(npas, d.ToAggregate())
	}

	return npas, nil
}

func (r *RepoNpa) GetById(ctx context.Context, id uuid.UUID) (*npa.Npa, error) {
	var d mongoNpa
	if err := r.Coll().FindOne(ctx, map[string]uuid.UUID{"_id": id}).Decode(&d); err != nil {
		return nil, err
	}
	return d.ToAggregate(), nil
}

func (r *RepoNpa) Create(ctx context.Context, d *npa.Npa) error {
	_, err := r.Coll().InsertOne(ctx, newFromNpa(d))
	return err
}

func (r *RepoNpa) Update(ctx context.Context, d *npa.Npa) error {
	_, err := r.Coll().UpdateOne(ctx, map[string]uuid.UUID{"_id": d.GetID()}, map[string]interface{}{"$set": newFromNpa(d)})
	return err
}

func (r *RepoNpa) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, map[string]uuid.UUID{"_id": id})
	return err
}
