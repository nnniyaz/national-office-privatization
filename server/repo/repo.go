package repo

import (
	"context"

	"github.com/nnniyaz/nop/server/domain/application"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/contacts"
	"github.com/nnniyaz/nop/server/domain/document"
	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/domain/enterprise"
	"github.com/nnniyaz/nop/server/domain/event"
	"github.com/nnniyaz/nop/server/domain/mission"
	"github.com/nnniyaz/nop/server/domain/news"
	"github.com/nnniyaz/nop/server/domain/npa"
	"github.com/nnniyaz/nop/server/domain/partner"
	"github.com/nnniyaz/nop/server/domain/session"
	"github.com/nnniyaz/nop/server/domain/user"
	applicationMongo "github.com/nnniyaz/nop/server/repo/mongo/application"
	contactsMongo "github.com/nnniyaz/nop/server/repo/mongo/contacts"
	documentMongo "github.com/nnniyaz/nop/server/repo/mongo/document"
	employeeMongo "github.com/nnniyaz/nop/server/repo/mongo/employee"
	enterpriseMongo "github.com/nnniyaz/nop/server/repo/mongo/enterprise"
	eventMongo "github.com/nnniyaz/nop/server/repo/mongo/event"
	missionMongo "github.com/nnniyaz/nop/server/repo/mongo/mission"
	newsMongo "github.com/nnniyaz/nop/server/repo/mongo/news"
	npaMongo "github.com/nnniyaz/nop/server/repo/mongo/npa"
	partnerMongo "github.com/nnniyaz/nop/server/repo/mongo/partner"
	sessionMongo "github.com/nnniyaz/nop/server/repo/mongo/session"
	userMongo "github.com/nnniyaz/nop/server/repo/mongo/user"
	"go.mongodb.org/mongo-driver/mongo"
)

type User interface {
	Get(ctx context.Context) ([]*user.User, error)
	GetById(ctx context.Context, userId uuid.UUID) (*user.User, error)
	GetByLogin(ctx context.Context, login string) (*user.User, error)
	Create(ctx context.Context, u *user.User) error
	Update(ctx context.Context, u *user.User) error
	Delete(ctx context.Context, userId uuid.UUID) error
	Recover(ctx context.Context, userId uuid.UUID) error
}

type Session interface {
	Create(ctx context.Context, session *session.Session) error
	FindManyByUserId(ctx context.Context, userId uuid.UUID) ([]*session.Session, error)
	FindOneBySession(ctx context.Context, session uuid.UUID) (*session.Session, error)
	DeleteAllByUserId(ctx context.Context, userId uuid.UUID) error
	DeleteById(ctx context.Context, sessionId uuid.UUID) error
	DeleteByToken(ctx context.Context, token uuid.UUID) error
	UpdateLastActionAt(ctx context.Context, sessionId uuid.UUID) error
}

type Contacts interface {
	Get(ctx context.Context) (*contacts.Contacts, error)
	Create(ctx context.Context, contact *contacts.Contacts) error
	Update(ctx context.Context, contact *contacts.Contacts) error
}

type Mission interface {
	Get(ctx context.Context) (*mission.Mission, error)
	Create(ctx context.Context, m *mission.Mission) error
	Update(ctx context.Context, m *mission.Mission) error
}

type Employee interface {
	Get(ctx context.Context) ([]*employee.Employee, error)
	GetById(ctx context.Context, employeeId uuid.UUID) (*employee.Employee, error)
	Create(ctx context.Context, e *employee.Employee) error
	Update(ctx context.Context, e *employee.Employee) error
	Delete(ctx context.Context, employeeId uuid.UUID) error
}

type Partner interface {
	Get(ctx context.Context) ([]*partner.Partner, error)
	GetById(ctx context.Context, partnerId uuid.UUID) (*partner.Partner, error)
	Create(ctx context.Context, p *partner.Partner) error
	Update(ctx context.Context, p *partner.Partner) error
	Delete(ctx context.Context, partnerId uuid.UUID) error
}

type Document interface {
	Get(ctx context.Context) ([]*document.Document, error)
	GetById(ctx context.Context, documentId uuid.UUID) (*document.Document, error)
	Create(ctx context.Context, d *document.Document) error
	Update(ctx context.Context, d *document.Document) error
	Delete(ctx context.Context, documentId uuid.UUID) error
}

type Npa interface {
	Get(ctx context.Context) ([]*npa.Npa, error)
	GetById(ctx context.Context, npaId uuid.UUID) (*npa.Npa, error)
	Create(ctx context.Context, d *npa.Npa) error
	Update(ctx context.Context, d *npa.Npa) error
	Delete(ctx context.Context, npaId uuid.UUID) error
}

type News interface {
	Get(ctx context.Context) ([]*news.News, error)
	GetById(ctx context.Context, newsId uuid.UUID) (*news.News, error)
	Create(ctx context.Context, n *news.News) error
	Update(ctx context.Context, n *news.News) error
	Delete(ctx context.Context, newsId uuid.UUID) error
}

type Enterprise interface {
	Get(ctx context.Context, offset, limit int64, search, region, field string) ([]*enterprise.Enterprise, int64, error)
	GetById(ctx context.Context, enterpriseId uuid.UUID) (*enterprise.Enterprise, error)
	Create(ctx context.Context, e *enterprise.Enterprise) error
	Update(ctx context.Context, e *enterprise.Enterprise) error
	Delete(ctx context.Context, enterpriseId uuid.UUID) error
}

type Event interface {
	Get(ctx context.Context) ([]*event.Event, error)
	GetById(ctx context.Context, eventId uuid.UUID) (*event.Event, error)
	Create(ctx context.Context, e *event.Event) error
	Update(ctx context.Context, e *event.Event) error
	Delete(ctx context.Context, eventId uuid.UUID) error
}

type Application interface {
	Get(ctx context.Context) ([]*application.Application, error)
	GetById(ctx context.Context, applicationId uuid.UUID) (*application.Application, error)
	Create(ctx context.Context, a *application.Application) error
	Update(ctx context.Context, a *application.Application) error
	Delete(ctx context.Context, applicationId uuid.UUID) error
}

type Repository struct {
	RepoUser        User
	RepoSession     Session
	RepoContacts    Contacts
	RepoMission     Mission
	RepoEmployee    Employee
	RepoPartner     Partner
	RepoDocument    Document
	RepoNews        News
	RepoEnterprise  Enterprise
	RepoNpa         Npa
	RepoEvent       Event
	RepoApplication Application
}

func NewRepository(client *mongo.Client) *Repository {
	return &Repository{
		RepoUser:        userMongo.NewRepoUser(client),
		RepoSession:     sessionMongo.NewRepoSession(client),
		RepoContacts:    contactsMongo.NewRepoContact(client),
		RepoMission:     missionMongo.NewRepoMission(client),
		RepoEmployee:    employeeMongo.NewRepoEmployee(client),
		RepoPartner:     partnerMongo.NewRepoPartner(client),
		RepoDocument:    documentMongo.NewRepoDocument(client),
		RepoNews:        newsMongo.NewRepoNews(client),
		RepoEnterprise:  enterpriseMongo.NewRepoEnterprise(client),
		RepoNpa:         npaMongo.NewRepoNpa(client),
		RepoEvent:       eventMongo.NewRepoEvent(client),
		RepoApplication: applicationMongo.NewRepoApplication(client),
	}
}
