package employee

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoEmployee struct {
	client *mongo.Client
}

func NewRepoEmployee(client *mongo.Client) *RepoEmployee {
	return &RepoEmployee{client: client}
}

func (r *RepoEmployee) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("employee")
}

type mongoEmployee struct {
	Id    uuid.UUID     `bson:"_id"`
	Name  i18n.MlString `bson:"name"`
	Group string        `bson:"group"`
}

func newFromEmployee(e *employee.Employee) *mongoEmployee {
	return &mongoEmployee{
		Id:    e.GetID(),
		Name:  e.GetName(),
		Group: e.GetGroup(),
	}
}

func (m *mongoEmployee) ToAggregate() *employee.Employee {
	return employee.UnmarshalEmployeeFromDatabase(m.Id, m.Name, m.Group)
}

func (r *RepoEmployee) Get(ctx context.Context) ([]*employee.Employee, error) {
	var m []mongoEmployee
	cursor, err := r.Coll().Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, err
	}
	var employees []*employee.Employee
	for _, v := range m {
		employees = append(employees, v.ToAggregate())
	}
	return employees, nil
}

func (r *RepoEmployee) GetById(ctx context.Context, id uuid.UUID) (*employee.Employee, error) {
	var m mongoEmployee
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&m)
	if err != nil {
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoEmployee) Create(ctx context.Context, e *employee.Employee) error {
	_, err := r.Coll().InsertOne(ctx, newFromEmployee(e))
	return err
}

func (r *RepoEmployee) Update(ctx context.Context, e *employee.Employee) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": e.GetID()}, bson.M{"$set": newFromEmployee(e)})
	return err
}

func (r *RepoEmployee) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
