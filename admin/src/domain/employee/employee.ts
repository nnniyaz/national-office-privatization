import type { MlString } from '../../shared/i18n/types';

export interface EmployeeData {
    employees: Employee[];
    count: number;
}

export interface Employee {
    id: string;
    name: MlString;
    group: string;
}
