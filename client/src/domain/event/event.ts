import type { MlString } from '@/shared/i18n/types';

export interface EventData {
    events: Event[]
    count: number
}

export interface Event {
    id: string
    name: MlString
    desc: MlString
    imgUrl: string
    plannedAt: string
    createdAt: string
    updatedAt: string
}
