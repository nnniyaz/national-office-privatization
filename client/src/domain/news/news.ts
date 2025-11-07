import type { MlString } from '@/shared/i18n/types';

export interface NewsData {
    news: News[]
    count: number
}

export interface News {
    id: string
    title: MlString
    content: MlString
    imgUrl: string
    createdAt: string
}
