import { Event } from '../../../../domain/event/event.ts';

export interface EventState {
    events: Event[];
    event: Event | null;
    isLoading: boolean;
    error: string | null;
}

export enum EventActionEnum {
    SET_EVENTS = "SET_EVENTS",
    SET_EVENT = "SET_EVENT",
    SET_LOADING_EVENTS = "SET_LOADING_EVENTS",
    SET_ERROR_EVENTS = "SET_ERROR_EVENTS",
}

export interface SetEventsAction {
    type: EventActionEnum.SET_EVENTS;
    payload: Event[];
}

export interface SetEventAction {
    type: EventActionEnum.SET_EVENT;
    payload: Event | null;
}

export interface SetLoadingAction {
    type: EventActionEnum.SET_LOADING_EVENTS;
    payload: boolean;
}

export interface SetErrorAction {
    type: EventActionEnum.SET_ERROR_EVENTS;
    payload: string | null;
}

export type EventAction = SetEventsAction | SetEventAction | SetLoadingAction | SetErrorAction;
