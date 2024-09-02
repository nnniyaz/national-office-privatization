package document

import (
	"context"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/document"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoDocument struct {
	client *mongo.Client
}

func NewRepoDocument(client *mongo.Client) *RepoDocument {
	return &RepoDocument{client: client}
}

func (r *RepoDocument) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("document")
}

type mongoDocument struct {
	Id        uuid.UUID `bson:"_id"`
	Title     string    `bson:"title"`
	Filename  string    `bson:"filename"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromDocument(d *document.Document) *mongoDocument {
	return &mongoDocument{
		Id:        d.GetID(),
		Title:     d.GetTitle(),
		Filename:  d.GetFilename(),
		CreatedAt: d.GetCreatedAt(),
		UpdatedAt: d.GetUpdatedAt(),
	}
}

func (m *mongoDocument) ToAggregate() *document.Document {
	return document.UnmarshalDocumentFromDatabase(m.Id, m.Title, m.Filename, m.CreatedAt, m.UpdatedAt)
}

func (r *RepoDocument) Get(ctx context.Context) ([]*document.Document, error) {
	cursor, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var documents []*document.Document
	for cursor.Next(ctx) {
		var d mongoDocument
		if err := cursor.Decode(&d); err != nil {
			return nil, err
		}
		documents = append(documents, d.ToAggregate())
	}

	return documents, nil
}

func (r *RepoDocument) GetById(ctx context.Context, id uuid.UUID) (*document.Document, error) {
	var d mongoDocument
	if err := r.Coll().FindOne(ctx, map[string]uuid.UUID{"_id": id}).Decode(&d); err != nil {
		return nil, err
	}
	return d.ToAggregate(), nil
}

func (r *RepoDocument) Create(ctx context.Context, d *document.Document) error {
	_, err := r.Coll().InsertOne(ctx, newFromDocument(d))
	return err
}

func (r *RepoDocument) Update(ctx context.Context, d *document.Document) error {
	_, err := r.Coll().UpdateOne(ctx, map[string]uuid.UUID{"_id": d.GetID()}, map[string]interface{}{"$set": newFromDocument(d)})
	return err
}

func (r *RepoDocument) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, map[string]uuid.UUID{"_id": id})
	return err
}
