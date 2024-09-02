package partner

import (
	"context"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/domain/partner"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoPartner struct {
	client *mongo.Client
}

func NewRepoPartner(client *mongo.Client) *RepoPartner {
	return &RepoPartner{client: client}
}

func (r *RepoPartner) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("partner")
}

type mongoPartner struct {
	Id   uuid.UUID `bson:"_id"`
	Name string    `bson:"name"`
	Link string    `bson:"link"`
}

func newFromPartner(p *partner.Partner) *mongoPartner {
	return &mongoPartner{
		Id:   p.GetID(),
		Name: p.GetName(),
		Link: p.GetLink(),
	}
}

func (m *mongoPartner) ToAggregate() *partner.Partner {
	return partner.UnmarshalPartnerFromDatabase(m.Id, m.Name, m.Link)
}

func (r *RepoPartner) Get(ctx context.Context) ([]*partner.Partner, error) {
	cursor, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var partners []*partner.Partner
	for cursor.Next(ctx) {
		var p mongoPartner
		if err := cursor.Decode(&p); err != nil {
			return nil, err
		}
		partners = append(partners, p.ToAggregate())
	}

	return partners, nil
}

func (r *RepoPartner) GetById(ctx context.Context, id uuid.UUID) (*partner.Partner, error) {
	var p mongoPartner
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&p)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return p.ToAggregate(), nil
}

func (r *RepoPartner) Create(ctx context.Context, p *partner.Partner) error {
	_, err := r.Coll().InsertOne(ctx, newFromPartner(p))
	return err
}

func (r *RepoPartner) Update(ctx context.Context, p *partner.Partner) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": p.GetID()}, bson.M{"$set": newFromPartner(p)})
	return err
}

func (r *RepoPartner) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
