export interface ApplicationData {
    applications: Application[]
    count: number
}

export interface Application {
    id: string
    enterpriseId: string
    fio: string
    bin: string
    phone: string
    email: string
    message: string
    createdAt: string
    updatedAt: string
}
