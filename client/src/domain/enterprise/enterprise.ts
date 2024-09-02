export interface EnterpriseData {
    enterprises: Enterprise[]
    count: number
}

export interface Enterprise {
    id: string
    name: string
    location: string
    industry: string
    governmentShare: number
    createdAt: string
    updatedAt: string
}
