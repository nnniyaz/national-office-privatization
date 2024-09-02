import {EventAction, EventActionEnum, EventState} from "./types.ts";

const initialState: EventState = {
    events: [],
    event: null,
    isLoading: false,
    error: null,
};

export default function eventReducer(state = initialState, action: EventAction): EventState {
    switch (action.type) {
        case EventActionEnum.SET_EVENTS:
            return {...state, events: action.payload};
        case EventActionEnum.SET_EVENT:
            return {...state, event: action.payload};
        case EventActionEnum.SET_LOADING_EVENTS:
            return {...state, isLoading: action.payload};
        case EventActionEnum.SET_ERROR_EVENTS:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
