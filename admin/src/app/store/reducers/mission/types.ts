import {Mission} from '../../../../domain/mission/mission.ts';

export interface MissionState {
    mission: Mission | null;
    isLoading: boolean;
    error: string | null;
}

export enum MissionActionEnum {
    SET_MISSION = "SET_MISSION",
    SET_LOADING_MISSION = "SET_LOADING_MISSION",
    SET_ERROR_MISSION = "SET_ERROR_MISSION",
}

export interface SetMissionAction {
    type: MissionActionEnum.SET_MISSION;
    payload: Mission | null;
}

export interface SetLoadingAction {
    type: MissionActionEnum.SET_LOADING_MISSION;
    payload: boolean;
}

export interface SetErrorAction {
    type: MissionActionEnum.SET_ERROR_MISSION;
    payload: string | null;
}

export type MissionAction = SetMissionAction | SetLoadingAction | SetErrorAction;
