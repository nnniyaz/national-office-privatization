import {
    EmployeeActionEnum,
    SetEmployeesAction,
    SetEmployeeAction,
    SetLoadingAction,
    SetErrorAction,
} from './types';
import {Employee_http as EmployeeService, EmployeeCreateReq, EmployeeUpdateReq} from "../../../api/employee/employee_http.ts";
import {AppDispatch, RootState} from "../../index.ts";
import {httpHandler, FailedResponseHandler} from "../../../../shared/http-handler/httpHandler.ts";
import {NavigateCallback} from "../../../../domain/base/navigateCallback.ts";
import {Employee} from "../../../../domain/employee/employee.ts";
import {Notify} from "../../../../shared/notification/notification.ts";
import {translate} from "../../../../shared/translate/translate.ts";
import {RouteNames} from "../../../../pages";

export const EmployeeActionCreator = {
    setEmployees: (payload: Employee[]): SetEmployeesAction => ({
        type: EmployeeActionEnum.SET_EMPLOYEES,
        payload
    }),
    setEmployee: (payload: Employee | null): SetEmployeeAction => ({
        type: EmployeeActionEnum.SET_EMPLOYEE,
        payload
    }),
    setLoading: (payload: boolean): SetLoadingAction => ({
        type: EmployeeActionEnum.SET_LOADING_EMPLOYEES,
        payload
    }),
    setError: (payload: string | null): SetErrorAction => ({
        type: EmployeeActionEnum.SET_ERROR_EMPLOYEES,
        payload
    }),

    getEmployees: (controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EmployeeActionCreator.setLoading(true));
            const res = await EmployeeService.getEmployees(controller);
            if (res.data.success) {
                dispatch(EmployeeActionCreator.setEmployees(res.data.data?.employees))
            } else {
                dispatch(EmployeeActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("employee_module", lang),
                    message: translate("failed_to_fetch_employees", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
            });
        } finally {
            dispatch(EmployeeActionCreator.setLoading(false));
        }
    },

    getOneEmployeeById: (employeeId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EmployeeActionCreator.setLoading(true));
            const res = await EmployeeService.getOneEmployeeById(employeeId);
            if (res.data.success) {
                dispatch(EmployeeActionCreator.setEmployee(res.data.data))
            } else {
                dispatch(EmployeeActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("employee_module", lang),
                    message: translate("failed_to_fetch_employee", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(EmployeeActionCreator.setLoading(false));
        }
    },

    createEmployee: (request: EmployeeCreateReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EmployeeActionCreator.setLoading(true));
            const res = await EmployeeService.createEmployee(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("employee_module", lang),
                    message: translate("employee_created_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.EMPLOYEES);
            } else {
                dispatch(EmployeeActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("employee_module", lang),
                    message: translate("failed_to_create_employee", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(EmployeeActionCreator.setLoading(false));
        }
    },

    updateEmployee: (request: EmployeeUpdateReq, employeeId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EmployeeActionCreator.setLoading(true));
            const res = await EmployeeService.updateEmployee(request);
            if (res.data.success) {
                Notify.Success({
                    title: translate("employee_module", lang),
                    message: translate("employee_updated_successfully", lang),
                    notificationApi: notificationApi!
                });
                await EmployeeActionCreator.getOneEmployeeById(employeeId, navigationCallback)(dispatch, getState);
            } else {
                dispatch(EmployeeActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("employee_module", lang),
                    message: translate("failed_to_update_employee", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(EmployeeActionCreator.setLoading(false));
        }
    },

    deleteEmployee: (employeeId: string, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {lang, notificationApi} = getState().system;
        try {
            dispatch(EmployeeActionCreator.setLoading(true));
            const res = await EmployeeService.deleteEmployee(employeeId);
            if (res.data.success) {
                Notify.Success({
                    title: translate("employee_module", lang),
                    message: translate("employee_deleted_successfully", lang),
                    notificationApi: notificationApi!
                });
                navigationCallback.navigate(RouteNames.EMPLOYEES);
            } else {
                dispatch(EmployeeActionCreator.setError(res.data.messages[0]))
                FailedResponseHandler({
                    notificationApi: notificationApi!,
                    title: translate("employee_module", lang),
                    message: translate("failed_to_delete_employee", lang),
                    httpStatus: res.status,
                });
            }
        } catch (e: any) {
            httpHandler({
                notificationApi: notificationApi!,
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: lang,
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(EmployeeActionCreator.setLoading(false));
        }
    },
}
