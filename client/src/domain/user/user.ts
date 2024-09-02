export interface UsersData {
    users: User[]
    count: number
}

export interface User {
    id: string
    firstName: string
    lastName: string
    login: string
    role: UserRoles
    disabled: boolean
    createdAt: string
    updatedAt: string
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user'
}
