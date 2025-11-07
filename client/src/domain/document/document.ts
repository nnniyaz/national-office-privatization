import type { MlString } from '@/shared/i18n/types';

export interface DocumentData {
    documents: Document[]
    count: number
}

export interface Document {
    id: string
    title: MlString
    filename: string
    createdAt: string
    updatedAt: string
}
