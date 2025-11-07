package news

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/news"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	newsService "github.com/nnniyaz/nop/server/service/news"
)

type HttpDelivery struct {
	logger  logger.Logger
	service newsService.NewsService
}

func NewHttpDelivery(l logger.Logger, service newsService.NewsService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type News struct {
	Id        string        `json:"id"`
	Title     i18n.MlString `json:"title"`
	Content   i18n.MlString `json:"content"`
	ImgUrl    string        `json:"imgUrl"`
	CreatedAt string        `json:"createdAt"`
}

func NewNews(n *news.News) *News {
	return &News{
		Id:        n.GetID().String(),
		Title:     n.GetTitle(),
		Content:   n.GetContent(),
		ImgUrl:    n.GetImgUrl(),
		CreatedAt: n.GetCreatedAt().Format(time.RFC3339),
	}
}

type NewsList struct {
	News  []*News `json:"news"`
	Count int     `json:"count"`
}

func NewNewsList(news []*news.News) *NewsList {
	var list []*News
	for _, item := range news {
		list = append(list, &News{
			Id:        item.GetID().String(),
			Title:     item.GetTitle(),
			Content:   item.GetContent(),
			ImgUrl:    item.GetImgUrl(),
			CreatedAt: item.GetCreatedAt().Format(time.RFC3339),
		})
	}
	return &NewsList{
		News:  list,
		Count: len(news),
	}
}

// GetNews godoc
//
//	@Summary		Get all news
//	@Description	Retrieves a list of all news articles with multilingual title and content
//	@Tags			news
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	NewsList
//	@Failure		500	{object}	response.Error
//	@Router			/api/news [get]
func (hd *HttpDelivery) GetNews(w http.ResponseWriter, r *http.Request) {
	news, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNewsList(news))
}

// GetNewsById godoc
//
//	@Summary		Get news by ID
//	@Description	Retrieves a single news article by its ID
//	@Tags			news
//	@Accept			json
//	@Produce		json
//	@Param			news_id	path		string	true	"News ID"
//	@Success		200		{object}	News
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/news/{news_id} [get]
func (hd *HttpDelivery) GetNewsById(w http.ResponseWriter, r *http.Request) {
	news, err := hd.service.GetById(r.Context(), chi.URLParam(r, "news_id"))
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNews(news))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateNewsIn struct {
	Title   i18n.MlString `json:"title"`
	Content i18n.MlString `json:"content"`
	ImgUrl  string        `json:"imgUrl"`
}

// CreateNews godoc
//
//	@Summary		Create a new news article
//	@Description	Creates a new news article with multilingual title and content
//	@Tags			news
//	@Accept			json
//	@Produce		json
//	@Param			news	body		CreateNewsIn	true	"News data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/news [post]
//	@Security		Bearer
func (hd *HttpDelivery) CreateNews(w http.ResponseWriter, r *http.Request) {
	var in CreateNewsIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Create(r.Context(), in.Title, in.Content, in.ImgUrl); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateNewsIn struct {
	Id      string        `json:"id"`
	Title   i18n.MlString `json:"title"`
	Content i18n.MlString `json:"content"`
	ImgUrl  string        `json:"imgUrl"`
}

// UpdateNews godoc
//
//	@Summary		Update a news article
//	@Description	Updates an existing news article
//	@Tags			news
//	@Accept			json
//	@Produce		json
//	@Param			news	body		UpdateNewsIn	true	"News update data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/news [put]
//	@Security		Bearer
func (hd *HttpDelivery) UpdateNews(w http.ResponseWriter, r *http.Request) {
	var in UpdateNewsIn
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Update(r.Context(), in.Id, in.Title, in.Content, in.ImgUrl); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

// DeleteNews godoc
//
//	@Summary		Delete a news article
//	@Description	Deletes a news article by ID
//	@Tags			news
//	@Accept			json
//	@Produce		json
//	@Param			news_id	path		string	true	"News ID"
//	@Success		200		{object}	response.Success
//	@Failure		404		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/news/{news_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeleteNews(w http.ResponseWriter, r *http.Request) {
	newsId := chi.URLParam(r, "news_id")
	if err := hd.service.Delete(r.Context(), newsId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
