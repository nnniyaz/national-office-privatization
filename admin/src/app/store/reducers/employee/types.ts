import { Employee } from '../../../../domain/employee/employee.ts';

export interface EmployeeState {
    employees: Employee[];
    employee: Employee | null;
    isLoading: boolean;
    error: string | null;
}

export enum EmployeeActionEnum {
    SET_EMPLOYEES = "SET_EMPLOYEES",
    SET_EMPLOYEE = "SET_EMPLOYEE",
    SET_LOADING_EMPLOYEES = "SET_LOADING_EMPLOYEES",
    SET_ERROR_EMPLOYEES = "SET_ERROR_EMPLOYEES",
}

export interface SetEmployeesAction {
    type: EmployeeActionEnum.SET_EMPLOYEES;
    payload: Employee[];
}

export interface SetEmployeeAction {
    type: EmployeeActionEnum.SET_EMPLOYEE;
    payload: Employee | null;
}

export interface SetLoadingAction {
    type: EmployeeActionEnum.SET_LOADING_EMPLOYEES;
    payload: boolean;
}

export interface SetErrorAction {
    type: EmployeeActionEnum.SET_ERROR_EMPLOYEES;
    payload: string | null;
}

export type EmployeeAction = SetEmployeesAction | SetEmployeeAction | SetLoadingAction | SetErrorAction;
