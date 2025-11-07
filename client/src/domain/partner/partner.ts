import type { MlString } from '@/shared/i18n/types';

export interface PartnerData {
    partners: Partner[]
    count: number
}

export interface Partner {
    id: string
    name: MlString
    link: string
}
