package enterprise

import (
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/enterprise/exceptions"
)

type Enterprise struct {
	id                       uuid.UUID
	name                     string
	location                 string
	industry                 string
	governmentShare          float64
	juridicalForm            string
	year                     int
	owner                    string
	mainActivity             string
	authorizedCapital        float64
	authorizedCapitalComment string
	assets                   float64
	assetsComment            string
	equity                   float64
	equityComment            string
	income                   float64
	incomeComment            string
	netProfit                float64
	netProfitComment         string
	numberOfEmployees        int
	numberOfEmployeesComment string
	totalLiabilities         float64
	totalLiabilitiesComment  string
	propertyComplex          string
	additionalInfo           string
	salesRecommendations     string
	implementationForm       string
	salePurpose              string
	keyTerms                 string
	additionalTerms          string
	createdAt                time.Time
	updatedAt                time.Time
}

func NewEnterprise(
	name, location, industry string,
	governmentShare float64,
	juridicalForm string,
	year int,
	owner, mainActivity string,
	authorizedCapital float64,
	authorizedCapitalComment string,
	assets float64,
	assetsComment string,
	equity float64,
	equityComment string,
	income float64,
	incomeComment string,
	netProfit float64,
	netProfitComment string,
	numberOfEmployees int,
	numberOfEmployeesComment string,
	totalLiabilities float64,
	totalLiabilitiesComment string,
	propertyComplex, additionalInfo, salesRecommendations, implementationForm, salePurpose, keyTerms, additionalTerms string,
) (*Enterprise, error) {
	if name == "" {
		return nil, exceptions.ErrInvalidEnterpriseName
	}
	return &Enterprise{
		id:                       uuid.NewUUID(),
		name:                     name,
		location:                 location,
		industry:                 industry,
		governmentShare:          governmentShare,
		juridicalForm:            juridicalForm,
		year:                     year,
		owner:                    owner,
		mainActivity:             mainActivity,
		authorizedCapital:        authorizedCapital,
		authorizedCapitalComment: authorizedCapitalComment,
		assets:                   assets,
		assetsComment:            assetsComment,
		equity:                   equity,
		equityComment:            equityComment,
		income:                   income,
		incomeComment:            incomeComment,
		netProfit:                netProfit,
		netProfitComment:         netProfitComment,
		numberOfEmployees:        numberOfEmployees,
		numberOfEmployeesComment: numberOfEmployeesComment,
		totalLiabilities:         totalLiabilities,
		totalLiabilitiesComment:  totalLiabilitiesComment,
		propertyComplex:          propertyComplex,
		additionalInfo:           additionalInfo,
		salesRecommendations:     salesRecommendations,
		implementationForm:       implementationForm,
		salePurpose:              salePurpose,
		keyTerms:                 keyTerms,
		additionalTerms:          additionalTerms,
		createdAt:                time.Now(),
		updatedAt:                time.Now(),
	}, nil
}

func (e *Enterprise) GetID() uuid.UUID {
	return e.id
}

func (e *Enterprise) GetName() string {
	return e.name
}

func (e *Enterprise) GetLocation() string {
	return e.location
}

func (e *Enterprise) GetIndustry() string {
	return e.industry
}

func (e *Enterprise) GetGovernmentShare() float64 {
	return e.governmentShare
}

func (e *Enterprise) GetJuridicalForm() string {
	return e.juridicalForm
}

func (e *Enterprise) GetYear() int {
	return e.year
}

func (e *Enterprise) GetOwner() string {
	return e.owner
}

func (e *Enterprise) GetMainActivity() string {
	return e.mainActivity
}

func (e *Enterprise) GetAuthorizedCapital() float64 {
	return e.authorizedCapital
}

func (e *Enterprise) GetAuthorizedCapitalComment() string {
	return e.authorizedCapitalComment
}

func (e *Enterprise) GetAssets() float64 {
	return e.assets
}

func (e *Enterprise) GetAssetsComment() string {
	return e.assetsComment
}

func (e *Enterprise) GetEquity() float64 {
	return e.equity
}

func (e *Enterprise) GetEquityComment() string {
	return e.equityComment
}

func (e *Enterprise) GetIncome() float64 {
	return e.income
}

func (e *Enterprise) GetIncomeComment() string {
	return e.incomeComment
}

func (e *Enterprise) GetNetProfit() float64 {
	return e.netProfit
}

func (e *Enterprise) GetNetProfitComment() string {
	return e.netProfitComment
}

func (e *Enterprise) GetNumberOfEmployees() int {
	return e.numberOfEmployees
}

func (e *Enterprise) GetNumberOfEmployeesComment() string {
	return e.numberOfEmployeesComment
}

func (e *Enterprise) GetTotalLiabilities() float64 {
	return e.totalLiabilities
}

func (e *Enterprise) GetTotalLiabilitiesComment() string {
	return e.totalLiabilitiesComment
}

func (e *Enterprise) GetPropertyComplex() string {
	return e.propertyComplex
}

func (e *Enterprise) GetAdditionalInfo() string {
	return e.additionalInfo
}

func (e *Enterprise) GetSalesRecommendations() string {
	return e.salesRecommendations
}

func (e *Enterprise) GetImplementationForm() string {
	return e.implementationForm
}

func (e *Enterprise) GetSalePurpose() string {
	return e.salePurpose
}

func (e *Enterprise) GetKeyTerms() string {
	return e.keyTerms
}

func (e *Enterprise) GetAdditionalTerms() string {
	return e.additionalTerms
}

func (e *Enterprise) GetCreatedAt() time.Time {
	return e.createdAt
}

func (e *Enterprise) GetUpdatedAt() time.Time {
	return e.updatedAt
}

func (e *Enterprise) Update(
	name, location, industry string,
	governmentShare float64,
	juridicalForm string,
	year int,
	owner, mainActivity string,
	authorizedCapital float64,
	authorizedCapitalComment string,
	assets float64,
	assetsComment string,
	equity float64,
	equityComment string,
	income float64,
	incomeComment string,
	netProfit float64,
	netProfitComment string,
	numberOfEmployees int,
	numberOfEmployeesComment string,
	totalLiabilities float64,
	totalLiabilitiesComment string,
	propertyComplex, additionalInfo, salesRecommendations, implementationForm, salePurpose, keyTerms, additionalTerms string,
) error {
	if name == "" {
		return exceptions.ErrInvalidEnterpriseName
	}
	if location == "" {
		return exceptions.ErrInvalidEnterpriseLocation
	}
	if industry == "" {
		return exceptions.ErrInvalidEnterpriseIndustry
	}
	if governmentShare < 0 {
		return exceptions.ErrInvalidEnterpriseGovShare
	}
	e.name = name
	e.location = location
	e.industry = industry
	e.governmentShare = governmentShare
	e.juridicalForm = juridicalForm
	e.year = year
	e.owner = owner
	e.mainActivity = mainActivity
	e.authorizedCapital = authorizedCapital
	e.authorizedCapitalComment = authorizedCapitalComment
	e.assets = assets
	e.assetsComment = assetsComment
	e.equity = equity
	e.equityComment = equityComment
	e.income = income
	e.incomeComment = incomeComment
	e.netProfit = netProfit
	e.netProfitComment = netProfitComment
	e.numberOfEmployees = numberOfEmployees
	e.numberOfEmployeesComment = numberOfEmployeesComment
	e.totalLiabilities = totalLiabilities
	e.totalLiabilitiesComment = totalLiabilitiesComment
	e.propertyComplex = propertyComplex
	e.additionalInfo = additionalInfo
	e.salesRecommendations = salesRecommendations
	e.implementationForm = implementationForm
	e.salePurpose = salePurpose
	e.keyTerms = keyTerms
	e.additionalTerms = additionalTerms
	e.updatedAt = time.Now()
	return nil
}

func UnmarshalEnterpriseFromDatabase(
	id uuid.UUID,
	name, location, industry string,
	governmentShare float64,
	juridicalForm string,
	year int,
	owner, mainActivity string,
	authorizedCapital float64,
	authorizedCapitalComment string,
	assets float64,
	assetsComment string,
	equity float64,
	equityComment string,
	income float64,
	incomeComment string,
	netProfit float64,
	netProfitComment string,
	numberOfEmployees int,
	numberOfEmployeesComment string,
	totalLiabilities float64,
	totalLiabilitiesComment string,
	propertyComplex, additionalInfo, salesRecommendations, implementationForm, salePurpose, keyTerms, additionalTerms string,
	createdAt, updatedAt time.Time,
) *Enterprise {
	return &Enterprise{
		id:                       id,
		name:                     name,
		location:                 location,
		industry:                 industry,
		governmentShare:          governmentShare,
		juridicalForm:            juridicalForm,
		year:                     year,
		owner:                    owner,
		mainActivity:             mainActivity,
		authorizedCapital:        authorizedCapital,
		authorizedCapitalComment: authorizedCapitalComment,
		assets:                   assets,
		assetsComment:            assetsComment,
		equity:                   equity,
		equityComment:            equityComment,
		income:                   income,
		incomeComment:            incomeComment,
		netProfit:                netProfit,
		netProfitComment:         netProfitComment,
		numberOfEmployees:        numberOfEmployees,
		numberOfEmployeesComment: numberOfEmployeesComment,
		totalLiabilities:         totalLiabilities,
		totalLiabilitiesComment:  totalLiabilitiesComment,
		propertyComplex:          propertyComplex,
		additionalInfo:           additionalInfo,
		salesRecommendations:     salesRecommendations,
		implementationForm:       implementationForm,
		salePurpose:              salePurpose,
		keyTerms:                 keyTerms,
		additionalTerms:          additionalTerms,
		createdAt:                createdAt,
		updatedAt:                updatedAt,
	}
}

/*

Enterprise struct:
{
	name                     "Некоммерческое акционерное общество «Университет КИМЭП»"
	location                 ""
	industry                 ""
	governmentShare          0.0
	juridicalForm            ""
	year                     0
	owner                    ""
	mainActivity             ""
	authorizedCapital        0.0
	authorizedCapitalComment ""
	assets                   0.0
	assetsComment            ""
	equity                   0.0
	equityComment            ""
	income                   0.0
	incomeComment            ""
	netProfit                0.0
	netProfitComment         ""
	numberOfEmployees        0
	numberOfEmployeesComment ""
	totalLiabilities         0.0
	totalLiabilitiesComment  ""
	propertyComplex          ""
	additionalInfo           ""
	salesRecommendations     "2030 год"
	implementationForm       "тендер"
	salePurpose              ""
	keyTerms                 ""
	additionalTerms          ""
}

*/

// ------------------------------------------------------------

/*

Наименование: 							строка 						(Пример: ТОО «ПНХЗ» (Павлодарский нефтехимический завод))
Местоположение: 						строка 						(Пример: Республика Казахстан, г. Павлодар, ул. улица Химиков 1)
Отрасль: 								строка 						(Пример: Нефтегазовая отрасль)
Доля государства: 						число с плавающей запятой 	(Пример: 100.0; (означает 100% государственной собственности))
Организационно-правовая форма: 			строка 						(Пример: Товарищество с ограниченной ответственномтью)
Год: 									целое число 				(Пример: 1995) (Год основания предприятия)
Учредитель: 							строка 						(Пример: 100% акций принадлежат АО «Национальная компания «КазМунайГаз».)
Основная деятельность: 					строка 						(Пример: Переработка нефти и производство нефтепродуктов)
Уставный капитал: 						число с плавающей запятой 	(Пример: 23846240,00)
Примечание к уставному капиталу: 		строка 						(Пример: Согласно данным госсреестра за 2023 год)
Активы: 								число с плавающей запятой
Примечание к активам: 					строка 						(Пример: Согласно данным госсреестра за 2023 год)
Собственный капитал: 					число с плавающей запятой
Примечание к собственному капиталу: 	строка 						(Пример: Согласно данным госсреестра за 2023 год)
Доход: 									число с плавающей запятой
Примечание к доходу: 					строка 						(Пример: Согласно данным госсреестра за 2023 год)
Чистая прибыль: 						число с плавающей запятой
Примечание к чистой прибыли: 			строка 						(Пример: Согласно данным госсреестра за 2023 год)
Количество сотрудников: 				целое число
Комментарий к количеству сотрудников: 	строка 						(Пример: Данные с сайта предприятия)
Совокупные обязательства: 				число с плавающей запятой
Комментарий к общим обязательствам: 	строка 						(Пример: Согласно данным госсреестра за 2023 год)
Имущественный комплекс: 				строка 						(Пример: Имущественный комплекс ТОО «Павлодарский нефтехимический завод» представляет собой сложную совокупность технологического оборудования, зданий, сооружений, коммуникаций и инфраструктуры, предназначенных для непрерывного цикла переработки нефти.)
Дополнительная информация: 				строка 						(Пример: Это крупнейшее предприятие на северо-востоке Казахстана, занимающееся переработкой нефти и производством широкого спектра нефтепродуктов. Завод является одним из трех ключевых нефтеперерабатывающих заводов в республике.)
Рекомендации по продажам: 				строка 						(Пример: способ реализации: открытый двухэтапный конкурс / электронный конкурс / прямая адресная продажа 2028 год)
Форма реализации: 						строка 						(Пример: продажа 100% доли (или контрольной доли) компании стратегическому инвестору с опытом в нефтепереработке либо через приватизацию/переход в смешанную форму собственности.)
Цель продажи: 							строка 						(Пример: привлечение инвестиций для модернизации производства, повышения эффективности, освоения дополнительных рынков.)
Ключевые условия: 						строка 						(Пример: обязательное проведение комплексного аудита (финансового, юридического, экологического), подготовка обновлённого бизнес-плана с CAPEX и ROI, оценка активов и обязательств.)
Дополнительные условия: 				строка 						(Пример: разграничение непрофильных активов, оценка инфраструктурных затрат, реструктуризация долговых обязательств, возможно, разработка программ оптимизации.)

*/

// ------------------------------------------------------------

/*

Город Астана
Город Алма-Ата
Город Шымкент
Абайская область
Акмолинская область
Актюбинская область
Алматинская область
Атырауская область
Восточно-Казахстанская область
Жамбылская область
Жетысуская область
Западно-Казахстанская область
Карагандинская область
Костанайская область
Кызылординская область
Мангистауская область
Павлодарская область
Северо-Казахстанская область
Туркестанская область
Улытауская область

*/
