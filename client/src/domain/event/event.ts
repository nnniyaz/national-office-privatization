export interface EventData {
    events: Event[]
    count: number
}

export interface Event {
    id: string
    name: string
    desc: string
    imgUrl: string
    plannedAt: string
    createdAt: string
    updatedAt: string
}
