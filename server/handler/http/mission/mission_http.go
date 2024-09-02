package mission

import (
	"encoding/json"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/service/mission"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service mission.MissionService
}

func NewHttpDelivery(l logger.Logger, service mission.MissionService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

type Mission struct {
	Id   string `json:"id"`
	Text string `json:"text"`
}

func (hd *HttpDelivery) GetMission(w http.ResponseWriter, r *http.Request) {
	foundMission, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	m := Mission{
		Id:   foundMission.GetID().String(),
		Text: foundMission.GetText(),
	}
	response.NewSuccess(hd.logger, w, r, m)
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateMissionIn struct {
	Text string `json:"text"`
}

func (hd *HttpDelivery) CreateMission(w http.ResponseWriter, r *http.Request) {
	in := CreateMissionIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Create(r.Context(), in.Text); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateMissionIn struct {
	Text string `json:"text"`
}

func (hd *HttpDelivery) UpdateMission(w http.ResponseWriter, r *http.Request) {
	in := UpdateMissionIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewBad(hd.logger, w, r, err)
		return
	}

	if err := hd.service.Update(r.Context(), in.Text); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}

	response.NewSuccess(hd.logger, w, r, nil)
}
