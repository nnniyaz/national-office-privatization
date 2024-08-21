package service

import (
	"github.com/aws/aws-sdk-go/service/s3"
	"github/nnniyaz/ardo/config"
	"github/nnniyaz/ardo/pkg/email"
	"github/nnniyaz/ardo/pkg/logger"
	"github/nnniyaz/ardo/repo"
	"github/nnniyaz/ardo/service/upload"
)

type Services struct {
	Upload upload.UploadService
}

func NewService(repos *repo.Repository, config *config.Config, l logger.Logger, emailService email.Email, s3 *s3.S3) *Services {

	return &Services{
		Upload: upload.NewUploadService(l, s3),
	}
}
