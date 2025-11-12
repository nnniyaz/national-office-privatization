package http

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/nnniyaz/nop/server/config"
	_ "github.com/nnniyaz/nop/server/docs"
	"github.com/nnniyaz/nop/server/handler/http/application"
	"github.com/nnniyaz/nop/server/handler/http/auth"
	"github.com/nnniyaz/nop/server/handler/http/contacts"
	"github.com/nnniyaz/nop/server/handler/http/document"
	"github.com/nnniyaz/nop/server/handler/http/employee"
	"github.com/nnniyaz/nop/server/handler/http/enterprise"
	"github.com/nnniyaz/nop/server/handler/http/event"
	middleware2 "github.com/nnniyaz/nop/server/handler/http/middleware"
	"github.com/nnniyaz/nop/server/handler/http/mission"
	"github.com/nnniyaz/nop/server/handler/http/news"
	"github.com/nnniyaz/nop/server/handler/http/npa"
	"github.com/nnniyaz/nop/server/handler/http/partner"
	"github.com/nnniyaz/nop/server/handler/http/upload"
	"github.com/nnniyaz/nop/server/handler/http/user"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/service"
	httpSwagger "github.com/swaggo/http-swagger"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	Middleware  *middleware2.Middleware
	User        *user.HttpDelivery
	Auth        *auth.HttpDelivery
	Contacts    *contacts.HttpDelivery
	Mission     *mission.HttpDelivery
	Employee    *employee.HttpDelivery
	Partner     *partner.HttpDelivery
	Document    *document.HttpDelivery
	News        *news.HttpDelivery
	Enterprise  *enterprise.HttpDelivery
	Npa         *npa.HttpDelivery
	Event       *event.HttpDelivery
	Application *application.HttpDelivery
	Upload      *upload.HttpDelivery
}

func NewHandler(c *mongo.Client, cfg *config.Config, s *service.Services, l logger.Logger) *Handler {
	return &Handler{
		Middleware:  middleware2.New(l, c, s.Auth),
		User:        user.NewHttpDelivery(l, s.User),
		Auth:        auth.NewHttpDelivery(l, s.Auth),
		Contacts:    contacts.NewHttpDelivery(l, s.Contacts),
		Mission:     mission.NewHttpDelivery(l, s.Mission),
		Employee:    employee.NewHttpDelivery(l, s.Employee),
		Partner:     partner.NewHttpDelivery(l, s.Partner),
		Document:    document.NewHttpDelivery(l, s.Document),
		News:        news.NewHttpDelivery(l, s.News),
		Enterprise:  enterprise.NewHttpDelivery(l, s.Enterprise),
		Npa:         npa.NewHttpDelivery(l, s.Npa),
		Event:       event.NewHttpDelivery(l, s.Event),
		Application: application.NewHttpDelivery(l, s.Application),
		Upload:      upload.NewHttpDelivery(l, s.Upload, cfg.GetSpaceBucket()),
	}
}

func (h *Handler) InitRoutes(isDevMode bool) *chi.Mux {
	r := chi.NewRouter()

	if isDevMode {
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins: []string{
				"http://localhost:3000",
				"https://localhost:3000",
				"http://localhost:3001",
				"https://localhost:3001",
			},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		}))
	} else {
		r.Use(cors.Handler(cors.Options{
			AllowedOrigins: []string{
				"https://admin.nop.kz",
				"https://azrk.nop.kz",
			},
			AllowedMethods: []string{
				http.MethodHead,
				http.MethodGet,
				http.MethodPost,
				http.MethodPut,
				http.MethodPatch,
				http.MethodDelete,
			},
			AllowedHeaders:   []string{"*"},
			AllowCredentials: true,
		}))
	}

	r.Use(h.Middleware.Recover)
	r.Use(h.Middleware.Trace)
	r.Use(h.Middleware.RequestInfo)
	r.Use(middleware.Logger)
	r.Use(middleware.RealIP)

	r.Get("/swagger/*", httpSwagger.WrapHandler)

	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/logout", h.Auth.Logout)
			r.With(h.Middleware.UserAuth).Get("/me", h.Auth.GetCurrentUser)
			r.With(h.Middleware.NoAuth).Post("/login", h.Auth.Login)
		})

		r.Route("/users", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Get("/", h.User.GetUsers)
			r.Get("/{user_id}", h.User.GetUserById)
			r.Post("/", h.User.CreateUser)
			r.Put("/", h.User.UpdateUser)
			r.Put("/password", h.User.UpdateUserPassword)
			r.Delete("/{user_id}", h.User.DeleteUser)
			r.Put("/{user_id}", h.User.RecoverUser)
		})

		r.Route("/contacts", func(r chi.Router) {
			r.Get("/", h.Contacts.GetContacts)
			r.With(h.Middleware.UserAuth).Post("/", h.Contacts.CreateContact)
			r.With(h.Middleware.UserAuth).Put("/", h.Contacts.UpdateContact)
		})

		r.Route("/mission", func(r chi.Router) {
			r.Get("/", h.Mission.GetMission)
			r.With(h.Middleware.UserAuth).Post("/", h.Mission.CreateMission)
			r.With(h.Middleware.UserAuth).Put("/", h.Mission.UpdateMission)
		})

		r.Route("/employee", func(r chi.Router) {
			r.Get("/", h.Employee.GetEmployees)
			r.With(h.Middleware.UserAuth).Get("/{employee_id}", h.Employee.GetEmployeeById)
			r.With(h.Middleware.UserAuth).Post("/", h.Employee.CreateEmployee)
			r.With(h.Middleware.UserAuth).Put("/", h.Employee.UpdateEmployee)
			r.With(h.Middleware.UserAuth).Delete("/{employee_id}", h.Employee.DeleteEmployee)
		})

		r.Route("/partner", func(r chi.Router) {
			r.Get("/", h.Partner.GetPartners)
			r.With(h.Middleware.UserAuth).Get("/{partner_id}", h.Partner.GetPartnerById)
			r.With(h.Middleware.UserAuth).Post("/", h.Partner.CreatePartner)
			r.With(h.Middleware.UserAuth).Put("/", h.Partner.UpdatePartner)
			r.With(h.Middleware.UserAuth).Delete("/{partner_id}", h.Partner.DeletePartner)
		})

		r.Route("/document", func(r chi.Router) {
			r.Get("/", h.Document.GetDocuments)
			r.With(h.Middleware.UserAuth).Get("/{document_id}", h.Document.GetDocumentById)
			r.With(h.Middleware.UserAuth).Post("/", h.Document.CreateDocument)
			r.With(h.Middleware.UserAuth).Put("/", h.Document.UpdateDocument)
			r.With(h.Middleware.UserAuth).Delete("/{document_id}", h.Document.DeleteDocument)
		})

		r.Route("/news", func(r chi.Router) {
			r.Get("/", h.News.GetNews)
			r.Get("/{news_id}", h.News.GetNewsById)
			r.With(h.Middleware.UserAuth).Post("/", h.News.CreateNews)
			r.With(h.Middleware.UserAuth).Put("/", h.News.UpdateNews)
			r.With(h.Middleware.UserAuth).Delete("/{news_id}", h.News.DeleteNews)
		})

		r.Route("/enterprise", func(r chi.Router) {
			r.With(h.Middleware.PaginationParams).Get("/", h.Enterprise.GetEnterprises)
			r.Get("/{enterprise_id}", h.Enterprise.GetEnterpriseById)
			r.With(h.Middleware.UserAuth).Post("/", h.Enterprise.CreateEnterprise)
			r.With(h.Middleware.UserAuth).Put("/", h.Enterprise.UpdateEnterprise)
			r.With(h.Middleware.UserAuth).Delete("/{enterprise_id}", h.Enterprise.DeleteEnterprise)
		})

		r.Route("/npa", func(r chi.Router) {
			r.Get("/", h.Npa.GetNpas)
			r.With(h.Middleware.UserAuth).Get("/{npa_id}", h.Npa.GetNpaById)
			r.With(h.Middleware.UserAuth).Post("/", h.Npa.CreateNpa)
			r.With(h.Middleware.UserAuth).Put("/", h.Npa.UpdateNpa)
			r.With(h.Middleware.UserAuth).Delete("/{npa_id}", h.Npa.DeleteNpa)
		})

		r.Route("/event", func(r chi.Router) {
			r.Get("/", h.Event.GetEvents)
			r.With(h.Middleware.UserAuth).Get("/{event_id}", h.Event.GetEventById)
			r.With(h.Middleware.UserAuth).Post("/", h.Event.CreateEvent)
			r.With(h.Middleware.UserAuth).Put("/", h.Event.UpdateEvent)
			r.With(h.Middleware.UserAuth).Delete("/{event_id}", h.Event.DeleteEvent)
		})

		r.Route("/application", func(r chi.Router) {
			r.With(h.Middleware.UserAuth).Get("/", h.Application.GetApplications)
			r.With(h.Middleware.UserAuth).Get("/{application_id}", h.Application.GetApplicationById)
			r.Post("/", h.Application.CreateApplication)
			r.With(h.Middleware.UserAuth).Put("/", h.Application.UpdateApplication)
			r.With(h.Middleware.UserAuth).Delete("/{application_id}", h.Application.DeleteApplication)
		})

		r.Route("/upload", func(r chi.Router) {
			r.Use(h.Middleware.UserAuth)
			r.Post("/document", h.Upload.UploadDocuments)
			r.Post("/npa", h.Upload.UploadNpa)
			r.Post("/news-image", h.Upload.UploadNewsImage)
			r.Post("/event-image", h.Upload.UploadEventImage)
			r.Post("/enterprise-passport", h.Upload.UploadEnterprisePassport)
		})
	})

	return r
}
