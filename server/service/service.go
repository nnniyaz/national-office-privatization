package service

import (
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/nnniyaz/nop/config"
	"github.com/nnniyaz/nop/pkg/email"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/repo"
	"github.com/nnniyaz/nop/service/application"
	"github.com/nnniyaz/nop/service/auth"
	"github.com/nnniyaz/nop/service/contacts"
	"github.com/nnniyaz/nop/service/document"
	"github.com/nnniyaz/nop/service/employee"
	"github.com/nnniyaz/nop/service/enterprise"
	"github.com/nnniyaz/nop/service/event"
	"github.com/nnniyaz/nop/service/mission"
	"github.com/nnniyaz/nop/service/news"
	"github.com/nnniyaz/nop/service/npa"
	"github.com/nnniyaz/nop/service/partner"
	"github.com/nnniyaz/nop/service/session"
	"github.com/nnniyaz/nop/service/upload"
	"github.com/nnniyaz/nop/service/user"
)

type Services struct {
	User        user.UserService
	Session     session.SessionService
	Auth        auth.AuthService
	Contacts    contacts.ContactsService
	Mission     mission.MissionService
	Employee    employee.EmployeeService
	Partner     partner.PartnerService
	Document    document.DocumentService
	News        news.NewsService
	Enterprise  enterprise.EnterpriseService
	Npa         npa.NpaService
	Event       event.EventService
	Application application.ApplicationService
	Upload      upload.UploadService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email, s3 *s3.S3) *Services {
	userService := user.NewUserService(l, repos.RepoUser)
	sessionsService := session.NewSessionService(l, repos.RepoSession)
	enterpriseService := enterprise.NewEnterpriseService(l, repos.RepoEnterprise)
	return &Services{
		User:        userService,
		Auth:        auth.NewAuthService(l, config, userService, sessionsService),
		Contacts:    contacts.NewContactService(l, repos.RepoContacts),
		Mission:     mission.NewMissionService(l, repos.RepoMission),
		Employee:    employee.NewEmployeeService(l, repos.RepoEmployee),
		Partner:     partner.NewPartnerService(l, repos.RepoPartner),
		Document:    document.NewDocumentService(l, repos.RepoDocument),
		News:        news.NewNewsService(l, repos.RepoNews),
		Enterprise:  enterpriseService,
		Npa:         npa.NewNpaService(l, repos.RepoNpa),
		Event:       event.NewEventService(l, repos.RepoEvent),
		Application: application.NewApplicationService(l, repos.RepoApplication, emailService, enterpriseService),
		Upload:      upload.NewUploadService(l, s3),
	}
}
