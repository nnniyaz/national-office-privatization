package user

import (
	"context"
	"errors"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/user"
	"github.com/nnniyaz/nop/server/domain/user/valueobject"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type RepoUser struct {
	client *mongo.Client
}

func NewRepoUser(client *mongo.Client) *RepoUser {
	return &RepoUser{client: client}
}

func (r *RepoUser) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("users")
}

type mongoPassword struct {
	Hash string `bson:"hash"`
	Salt string `bson:"salt"`
}

func newFromPassword(p valueobject.Password) mongoPassword {
	return mongoPassword{
		Hash: p.GetHash(),
		Salt: p.GetSalt(),
	}
}

func (m *mongoPassword) ToAggregate() valueobject.Password {
	return valueobject.UnmarshalPasswordFromDatabase(m.Hash, m.Salt)
}

type mongoUser struct {
	Id        uuid.UUID `bson:"_id"`
	FirstName string    `bson:"firstName"`
	LastName  string    `bson:"lastName"`
	Login     string    `bson:"login"`
	Password  mongoPassword
	Role      string    `bson:"role"`
	Disabled  bool      `bson:"disabled"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

func newFromUser(u *user.User) *mongoUser {
	return &mongoUser{
		Id:        u.GetID(),
		FirstName: u.GetFirstName(),
		LastName:  u.GetLastName(),
		Login:     u.GetLogin(),
		Password:  newFromPassword(u.GetPassword()),
		Role:      u.GetRole().String(),
		Disabled:  u.GetDisabled(),
		CreatedAt: u.GetCreatedAt(),
		UpdatedAt: u.GetUpdatedAt(),
	}
}

func (m *mongoUser) ToAggregate() *user.User {
	return user.UnmarshalUserFromDatabase(
		m.Id,
		m.FirstName,
		m.LastName,
		m.Login,
		m.Role,
		m.Password.ToAggregate(),
		m.Disabled,
		m.CreatedAt,
		m.UpdatedAt,
	)
}

func (r *RepoUser) Get(ctx context.Context) ([]*user.User, error) {
	cur, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var users []*user.User
	for cur.Next(ctx) {
		var u mongoUser
		err = cur.Decode(&u)
		if err != nil {
			return nil, err
		}
		users = append(users, u.ToAggregate())
	}
	return users, nil
}

func (r *RepoUser) GetById(ctx context.Context, userId uuid.UUID) (*user.User, error) {
	var u mongoUser
	err := r.Coll().FindOne(ctx, bson.M{"_id": userId}).Decode(&u)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return u.ToAggregate(), nil
}

func (r *RepoUser) GetByLogin(ctx context.Context, login string) (*user.User, error) {
	var u mongoUser
	err := r.Coll().FindOne(ctx, bson.M{"login": login}).Decode(&u)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return u.ToAggregate(), nil
}

func (r *RepoUser) Create(ctx context.Context, u *user.User) error {
	_, err := r.Coll().InsertOne(ctx, newFromUser(u))
	return err
}

func (r *RepoUser) Update(ctx context.Context, u *user.User) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": u.GetID(),
	}, bson.M{
		"$set": newFromUser(u),
	})
	return err
}

func (r *RepoUser) Delete(ctx context.Context, userId uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": userId,
	}, bson.M{
		"$set": bson.M{
			"disabled":  true,
			"updatedAt": time.Now(),
		},
	})
	return err
}

func (r *RepoUser) Recover(ctx context.Context, userId uuid.UUID) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": userId,
	}, bson.M{
		"$set": bson.M{
			"disabled":  false,
			"updatedAt": time.Now(),
		},
	})
	return err
}
