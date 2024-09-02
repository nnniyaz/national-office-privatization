export interface EmployeeData {
    employees: Employee[];
    count: number;
}

export interface Employee {
    id: string;
    name: string;
    group: string;
}
