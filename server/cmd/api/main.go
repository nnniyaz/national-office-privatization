package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/nnniyaz/nop/config"
	"github.com/nnniyaz/nop/handler/http"
	"github.com/nnniyaz/nop/pkg/email"
	"github.com/nnniyaz/nop/pkg/env"
	"github.com/nnniyaz/nop/pkg/logger"
	"github.com/nnniyaz/nop/pkg/mongo"
	"github.com/nnniyaz/nop/repo"
	"github.com/nnniyaz/nop/service"
	"go.uber.org/zap"
	nHttp "net/http"
	"os/signal"
	"syscall"
	"time"
)

const port = 8080

//	@title			Ardo Backend API
//	@version		0.0.1
//	@description	Detailed info about all endpoints

//	@contact.name	API Support
//	@contact.url	https://t.me/nassyrovich

//	@host		https://api.ardogroup.org
//	@schemes	https

// @securityDefinitions.apikey	ApiKeyAuth
// @in							header
// @name						Cookie

func main() {
	start := time.Now()

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	ctx = context.WithValue(ctx, "start", start)

	// --- init settings
	cfg := config.New(
		env.MustGetEnvAsBool("IS_DEV_MODE"),
		env.MustGetEnvAsInt("SMTP_PORT"),
		env.MustGetEnv("SMTP_USER"),
		env.MustGetEnv("SMTP_PASS"),
		env.MustGetEnv("SMTP_HOST"),
		env.MustGetEnv("MONGO_URI"),
		env.MustGetEnv("API_URI"),
		env.MustGetEnv("CLIENT_URI"),
		env.MustGetEnv("SPACE_KEY"),
		env.MustGetEnv("SPACE_SECRET"),
		env.MustGetEnv("SPACE_ENDPOINT"),
		env.MustGetEnv("SPACE_REGION"),
		env.MustGetEnv("SPACE_NAME"),
		env.MustGetEnv("SPACE_HOST"),
	)

	// --- init logger
	lg, err := logger.NewLogger(cfg.GetIsDevMode())
	if err != nil {
		panic(err)
	}
	defer lg.Sync()

	// --- init mongodb db
	db, err := mongo.New(ctx, cfg.GetMongoUri())
	if err != nil {
		lg.Fatal("failed to init mongodb", zap.Error(err))
		return
	}
	defer db.Disconnect(ctx)

	// --- init email service
	emailService, err := email.New(cfg.GetEmailCfg())
	if err != nil {
		lg.Fatal("failed to init email service", zap.Error(err))
		return
	}

	// --- init s3 client

	s3Config := &aws.Config{
		Credentials: credentials.NewStaticCredentials(cfg.GetSpaceKey(), cfg.GetSpaceSecret(), ""),
		Endpoint:    aws.String(cfg.GetSpaceEndPoint()),
		Region:      aws.String(cfg.GetSpaceRegion()),
	}

	newSession, err := session.NewSession(s3Config)
	if err != nil {
		lg.Fatal("failed to init s3 session", zap.Error(err))
		return
	}
	s3Client := s3.New(newSession)

	repos := repo.NewRepository(db)
	services := service.NewService(repos, cfg, lg, emailService, s3Client)
	handlers := http.NewHandler(db, cfg.GetClientUri(), services, lg)

	srv := new(ardo.Server)
	go func() {
		if err = srv.Run(port, handlers.InitRoutes(cfg.GetIsDevMode()), start); err != nil && err != nHttp.ErrServerClosed {
			lg.Fatal("error occurred while running http server: ", zap.Error(err))
		}
	}()

	<-ctx.Done()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		lg.Error("error occurred on server shutting down: ", zap.Error(err))
	}

	if err := db.Disconnect(shutdownCtx); err != nil {
		lg.Error("error occurred on db connection close: ", zap.Error(err))
	}

	fmt.Println("\n+-----------------------------------------------+")
	fmt.Println("| SERVER SHUTTING DOWN GRACEFULLY               |")
	fmt.Printf("| Finished at: %s        |\n", time.Now().Format("2006-01-02 15:04:05 -0700"))
	fmt.Printf("| Elapsed time: %s |\n", format.FormatDuration(time.Since(start)))
	fmt.Println("+-----------------------------------------------+")
}
