package http

import (
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	httpSwagger "github.com/swaggo/http-swagger"
	_ "github/nnniyaz/ardo/docs"
	middleware2 "github/nnniyaz/ardo/handler/http/middleware"
	"github/nnniyaz/ardo/handler/http/upload"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/service"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type Handler struct {
	Middleware *middleware2.Middleware
	Upload     *upload.HttpDelivery
}

func NewHandler(c *mongo.Client, clientUri string, s *service.Services, l logger.Logger) *Handler {
	return &Handler{
		Middleware: middleware2.New(l, c, s.Auth),
		Upload:     upload.NewHttpDelivery(l, s.Upload),
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
				"https://admin.ardogroup.org",
				"https://app.ardogroup.org",
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

	r.Route("/upload", func(r chi.Router) {
		r.Use(h.Middleware.StaffAuth)
		r.Post("/slide-image", h.Upload.UploadSlidesImage)
		r.Post("/section-image", h.Upload.UploadSectionImage)
		r.Post("/category-image", h.Upload.UploadCategoriesImage)
		r.Post("/product-image", h.Upload.UploadProductImage)
	})
	return r
}
