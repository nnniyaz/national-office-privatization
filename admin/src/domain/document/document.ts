export interface DocumentData {
    documents: Document[]
    count: number
}

export interface Document {
    id: string
    title: string
    filename: string
    createdAt: string
    updatedAt: string
}
