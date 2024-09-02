export interface NewsData {
    news: News[]
    count: number
}

export interface News {
    id: string
    title: string
    content: string
    imgUrl: string
    createdAt: string
}
