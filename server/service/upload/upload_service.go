package upload

import (
	"bytes"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/nnniyaz/nop/domain/base/uuid"
	"github.com/nnniyaz/nop/pkg/core"
	"github.com/nnniyaz/nop/pkg/logger"
	"io"
	"mime/multipart"
)

const MaxFileSize = 1 << 20

var ErrMaxFileSizeIs1MB = core.NewI18NError(core.EINVALID, core.TXT_MAX_FILE_SIZE_IS_1MB)

type UploadService interface {
	UploadImage(folderName string, file multipart.File, fileHeader *multipart.FileHeader) (string, error)
}

type uploadService struct {
	logger   logger.Logger
	s3Client *s3.S3
}

func NewUploadService(l logger.Logger, s3Client *s3.S3) UploadService {
	return &uploadService{logger: l, s3Client: s3Client}
}

func (s *uploadService) UploadImage(folderName string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	var buf bytes.Buffer
	io.Copy(&buf, file)
	if buf.Len() > MaxFileSize {
		return "", ErrMaxFileSizeIs1MB
	}
	fileName := uuid.NewUUID().String() + "_" + fileHeader.Filename
	_, err := s.s3Client.PutObject(&s3.PutObjectInput{
		Bucket:       aws.String("ardodev"),
		Key:          aws.String(folderName + "/" + fileName),
		Body:         bytes.NewReader(buf.Bytes()),
		ACL:          aws.String("public-read"),
		CacheControl: aws.String("max-age=21600000"),
		ContentType:  aws.String(fileHeader.Header.Get("Content-Type")),
	})
	buf.Reset()
	if err != nil {
		return "", err
	}
	return fileName, nil
}
