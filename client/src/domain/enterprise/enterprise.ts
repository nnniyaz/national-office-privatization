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
    juridicalForm: string
    year: number
    owner: string
    mainActivity: string
    authorizedCapital: number
    authorizedCapitalComment: string
    assets: number
    assetsComment: string
    equity: number
    equityComment: string
    income: number
    incomeComment: string
    netProfit: number
    netProfitComment: string
    numberOfEmployees: number
    numberOfEmployeesComment: string
    totalLiabilities: number
    totalLiabilitiesComment: string
    propertyComplex: string
    additionalInfo: string
    salesRecommendations: string
    implementationForm: string
    salePurpose: string
    keyTerms: string
    additionalTerms: string
    createdAt: string
    updatedAt: string
}
