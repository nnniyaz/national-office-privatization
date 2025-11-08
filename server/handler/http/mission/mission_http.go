package mission

import (
	"encoding/json"
	"net/http"

	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/service/mission"
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

// Mission represents the mission statement
type Mission struct {
	Id   string        `json:"id"`
	Text i18n.MlString `json:"text"`
}

// GetMission godoc
//
//	@Summary		Get mission
//	@Description	Retrieves the mission statement with multilingual text
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Mission
//	@Failure		500	{object}	response.Error
//	@Router			/api/mission [get]
func (hd *HttpDelivery) GetMission(w http.ResponseWriter, r *http.Request) {
	foundMission, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	// Mission может быть nil если ещё не создана (singleton)
	if foundMission == nil {
		response.NewSuccess(hd.logger, w, r, nil)
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
	Text i18n.MlString `json:"text"`
}

// CreateMission godoc
//
//	@Summary		Create mission
//	@Description	Creates a new mission statement
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			mission	body		CreateMissionIn	true	"Mission data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/mission [post]
//	@Security		Bearer
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
	Text i18n.MlString `json:"text"`
}

// UpdateMission godoc
//
//	@Summary		Update mission
//	@Description	Updates the mission statement
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			mission	body		UpdateMissionIn	true	"Mission update data"
//	@Success		200		{object}	response.Success
//	@Failure		400		{object}	response.Error
//	@Failure		500		{object}	response.Error
//	@Router			/api/mission [put]
//	@Security		Bearer
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
