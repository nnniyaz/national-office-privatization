import {MissionAction, MissionActionEnum, MissionState} from "./types.ts";

const initialState: MissionState = {
    mission: null,
    isLoading: false,
    error: null,
};

export default function missionReducer(state = initialState, action: MissionAction): MissionState {
    switch (action.type) {
        case MissionActionEnum.SET_MISSION:
            return {...state, mission: action.payload};
        case MissionActionEnum.SET_LOADING_MISSION:
            return {...state, isLoading: action.payload};
        case MissionActionEnum.SET_ERROR_MISSION:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
