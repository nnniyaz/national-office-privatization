package news

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/domain/news"
	"github.com/nnniyaz/nop/handler/http/response"
	"github.com/nnniyaz/nop/pkg/logger"
	newsService "github.com/nnniyaz/nop/service/news"
	"net/http"
	"time"
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
	Id        string `json:"id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	ImgUrl    string `json:"imgUrl"`
	CreatedAt string `json:"createdAt"`
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
	var n []*News
	for _, news := range news {
		n = append(n, &News{
			Id:        news.GetID().String(),
			Title:     news.GetTitle(),
			Content:   news.GetContent(),
			ImgUrl:    news.GetImgUrl(),
			CreatedAt: news.GetCreatedAt().String(),
		})
	}
	return &NewsList{
		News:  n,
		Count: len(news),
	}
}

func (hd *HttpDelivery) GetNews(w http.ResponseWriter, r *http.Request) {
	news, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewNewsList(news))
}

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
	Title   string `json:"title"`
	Content string `json:"content"`
	ImgUrl  string `json:"imgUrl"`
}

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
	Id      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	ImgUrl  string `json:"imgUrl"`
}

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

func (hd *HttpDelivery) DeleteNews(w http.ResponseWriter, r *http.Request) {
	newsId := chi.URLParam(r, "news_id")
	if err := hd.service.Delete(r.Context(), newsId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
