package contacts

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/contacts"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type RepoContacts struct {
	client *mongo.Client
}

func NewRepoContact(client *mongo.Client) *RepoContacts {
	return &RepoContacts{client: client}
}

func (r *RepoContacts) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("contacts")
}

type mongoContact struct {
	Id                     uuid.UUID `bson:"_id"`
	PrimaryContact         string    `bson:"primaryContact"`
	PrimaryContactPerson   string    `bson:"primaryContactPerson"`
	SecondaryContact       string    `bson:"secondaryContact"`
	SecondaryContactPerson string    `bson:"secondaryContactPerson"`
	Email                  string    `bson:"email"`
}

func newFromContact(c *contacts.Contacts) *mongoContact {
	return &mongoContact{
		Id:                     c.GetID(),
		PrimaryContact:         c.GetPrimaryContact(),
		PrimaryContactPerson:   c.GetPrimaryContactPerson(),
		SecondaryContact:       c.GetSecondaryContact(),
		SecondaryContactPerson: c.GetSecondaryContactPerson(),
		Email:                  c.GetEmail(),
	}
}

func (m *mongoContact) ToAggregate() *contacts.Contacts {
	return contacts.UnmarshalContactsFromDatabase(m.Id, m.PrimaryContact, m.PrimaryContactPerson, m.SecondaryContact, m.SecondaryContactPerson, m.Email)
}

func (r *RepoContacts) Get(ctx context.Context) (*contacts.Contacts, error) {
	cur, err := r.Coll().Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var contact mongoContact
	if cur.Next(ctx) {
		err = cur.Decode(&contact)
		if err != nil {
			return nil, err
		}
	}
	return contact.ToAggregate(), nil
}

func (r *RepoContacts) Create(ctx context.Context, c *contacts.Contacts) error {
	_, err := r.Coll().InsertOne(ctx, newFromContact(c))
	return err
}

func (r *RepoContacts) Update(ctx context.Context, c *contacts.Contacts) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{
		"_id": c.GetID(),
	}, bson.M{
		"$set": newFromContact(c),
	})
	return err
}
