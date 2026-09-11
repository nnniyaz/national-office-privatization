package upload

import (
	"bytes"
	"io"
	"mime/multipart"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/pkg/core"
	"github.com/nnniyaz/nop/server/pkg/logger"
)

// 5 MB:
const MaxFileSize = 5 * (1 << 20)

var ErrMaxFileSizeIs1MB = core.NewI18NError(core.EINVALID, core.TXT_MAX_FILE_SIZE_IS_1MB)

type UploadService interface {
	UploadImage(s3Bucket, folderName string, file multipart.File, fileHeader *multipart.FileHeader) (string, error)
}

type uploadService struct {
	logger   logger.Logger
	s3Client *s3.S3
	acl      string
}

// NewUploadService creates the S3 uploader. acl is the canned ACL for PutObject;
// "" or "none" disables the x-amz-acl header (required for Cloudflare R2).
func NewUploadService(l logger.Logger, s3Client *s3.S3, acl string) UploadService {
	if acl == "none" {
		acl = ""
	}
	return &uploadService{logger: l, s3Client: s3Client, acl: acl}
}

func (s *uploadService) UploadImage(s3Bucket, folderName string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	var buf bytes.Buffer
	io.Copy(&buf, file)
	if buf.Len() > MaxFileSize {
		return "", ErrMaxFileSizeIs1MB
	}
	fileName := uuid.NewUUID().String() + "_" + fileHeader.Filename
	input := &s3.PutObjectInput{
		Bucket:       aws.String(s3Bucket),
		Key:          aws.String(folderName + "/" + fileName),
		Body:         bytes.NewReader(buf.Bytes()),
		CacheControl: aws.String("max-age=21600000"),
		ContentType:  aws.String(fileHeader.Header.Get("Content-Type")),
	}
	if s.acl != "" {
		input.ACL = aws.String(s.acl)
	}
	_, err := s.s3Client.PutObject(input)
	buf.Reset()
	if err != nil {
		return "", err
	}
	return fileName, nil
}
