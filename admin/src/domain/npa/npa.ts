import type { MlString } from '../../shared/i18n/types';

export interface NpaData {
    npas: Npa[]
    count: number
}

export interface Npa {
    id: string
    title: MlString
    filename: string
    createdAt: string
    updatedAt: string
}
