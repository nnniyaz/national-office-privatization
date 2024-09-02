package news

import (
	"context"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/news"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoNews struct {
	client *mongo.Client
}

func NewRepoNews(client *mongo.Client) *RepoNews {
	return &RepoNews{client: client}
}

func (r *RepoNews) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("news")
}

type mongoNews struct {
	Id        uuid.UUID `bson:"_id"`
	Title     string    `bson:"title"`
	Content   string    `bson:"content"`
	ImgUrl    string    `bson:"imgUrl"`
	CreatedAt time.Time `bson:"createdAt"`
}

func newFromNews(n *news.News) *mongoNews {
	return &mongoNews{
		Id:        n.GetID(),
		Title:     n.GetTitle(),
		Content:   n.GetContent(),
		ImgUrl:    n.GetImgUrl(),
		CreatedAt: n.GetCreatedAt(),
	}
}

func (m *mongoNews) ToAggregate() *news.News {
	return news.UnmarshalNewsFromDatabase(m.Id, m.Title, m.Content, m.ImgUrl, m.CreatedAt)
}

func (r *RepoNews) Get(ctx context.Context) ([]*news.News, error) {
	var m []mongoNews
	cursor, err := r.Coll().Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, err
	}
	var newses []*news.News
	for _, v := range m {
		newses = append(newses, v.ToAggregate())
	}
	return newses, nil
}

func (r *RepoNews) GetById(ctx context.Context, id uuid.UUID) (*news.News, error) {
	var m mongoNews
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&m)
	if err != nil {
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoNews) Create(ctx context.Context, n *news.News) error {
	_, err := r.Coll().InsertOne(ctx, newFromNews(n))
	return err
}

func (r *RepoNews) Update(ctx context.Context, n *news.News) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": n.GetID()}, bson.M{"$set": newFromNews(n)})
	return err
}

func (r *RepoNews) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
