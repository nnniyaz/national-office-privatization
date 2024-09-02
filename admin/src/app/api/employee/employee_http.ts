import {AxiosResponse} from "axios";
import {$api, ApiRoutes, ErrorResponse, SuccessResponse} from "../index.ts";
import {Employee as EmployeeModel, EmployeeData} from "../../../domain/employee/employee.ts";

export interface EmployeeCreateReq {
    "name": string
    "group": string
}

export interface EmployeeUpdateReq {
    "id": string
    "name": string
    "group": string
}

export class Employee_http {
    static async getEmployees(controller: AbortController): Promise<AxiosResponse<SuccessResponse<EmployeeData> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ALL_EMPLOYEES, {signal: controller.signal})
    }

    static async getOneEmployeeById(employeeId: string): Promise<AxiosResponse<SuccessResponse<EmployeeModel> | ErrorResponse>> {
        return $api.get(ApiRoutes.GET_ONE_EMPLOYEE_BY_ID.replace(":employee_id", employeeId))
    }

    static async createEmployee(request: EmployeeCreateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.post(ApiRoutes.POST_CREATE_EMPLOYEE, request)
    }

    static async updateEmployee(request: EmployeeUpdateReq): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.put(ApiRoutes.PUT_UPDATE_EMPLOYEE, request)
    }

    static async deleteEmployee(employeeId: string): Promise<AxiosResponse<SuccessResponse<null> | ErrorResponse>> {
        return $api.delete(ApiRoutes.DELETE_EMPLOYEE.replace(":employee_id", employeeId))
    }
}
