package upload

import (
	"net/http"

	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/service/upload"
)

type HttpDelivery struct {
	logger   logger.Logger
	service  upload.UploadService
	s3Bucket string
}

func NewHttpDelivery(l logger.Logger, s upload.UploadService, s3Bucket string) *HttpDelivery {
	return &HttpDelivery{logger: l, service: s, s3Bucket: s3Bucket}
}

// UploadDocuments godoc
//
//	@Summary		Uploads a slide image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/slide-image [post]
func (hd *HttpDelivery) UploadDocuments(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage(hd.s3Bucket, "document", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadNpa godoc
//
//	@Summary		Uploads a section image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/section-image [post]
func (hd *HttpDelivery) UploadNpa(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage(hd.s3Bucket, "npa", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadNewsImage godoc
//
//	@Summary		Uploads a category image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/category-image [post]
func (hd *HttpDelivery) UploadNewsImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20) // 5 MB
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage(hd.s3Bucket, "news", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadEventImage godoc
//
//	@Summary		Uploads a product image
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/product-image [post]
func (hd *HttpDelivery) UploadEventImage(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage(hd.s3Bucket, "event", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}

// UploadEnterprisePassport godoc
//
//	@Summary		Uploads an enterprise passport
//	@Description	This can only be done by the logged-in user.
//	@Tags			Upload
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			data	formData	file	true	"file to upload"
//	@Success		200		{object}	response.Success
//	@Failure		default	{object}	response.Error
//	@Router			/upload/enterprise-passport [post]
func (hd *HttpDelivery) UploadEnterprisePassport(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(5 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	defer file.Close()
	fileName, err := hd.service.UploadImage(hd.s3Bucket, "enterprise-passport", file, header)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, struct {
		FileName string `json:"filename"`
	}{
		FileName: fileName,
	})
}
