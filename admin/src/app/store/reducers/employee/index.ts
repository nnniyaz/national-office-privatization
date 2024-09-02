import {EmployeeAction, EmployeeActionEnum, EmployeeState} from "./types.ts";

const initialState: EmployeeState = {
    employees: [],
    employee: null,
    isLoading: false,
    error: null,
};

export default function employeeReducer(state = initialState, action: EmployeeAction): EmployeeState {
    switch (action.type) {
        case EmployeeActionEnum.SET_EMPLOYEES:
            return {...state, employees: action.payload};
        case EmployeeActionEnum.SET_EMPLOYEE:
            return {...state, employee: action.payload};
        case EmployeeActionEnum.SET_LOADING_EMPLOYEES:
            return {...state, isLoading: action.payload};
        case EmployeeActionEnum.SET_ERROR_EMPLOYEES:
            return {...state, error: action.payload};
        default:
            return state;
    }
}
