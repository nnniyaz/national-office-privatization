export interface NpaData {
    npas: Npa[]
    count: number
}

export interface Npa {
    id: string
    title: string
    filename: string
    createdAt: string
    updatedAt: string
}
