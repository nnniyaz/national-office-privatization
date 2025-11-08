package e2e

import (
	"testing"

	"github.com/nnniyaz/nop/server/domain/enterprise"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEnterprise_NewEnterprise_Success(t *testing.T) {
	e, err := enterprise.NewEnterprise(
		"ТОО «Тест»",
		"г. Алматы",
		"IT",
		100.0,
		"ТОО",
		2020,
		"Государство",
		"Разработка ПО",
		1000000.0,
		"Уставный капитал примечание",
		5000000.0,
		"Активы примечание",
		3000000.0,
		"Капитал примечание",
		10000000.0,
		"Доход примечание",
		2000000.0,
		"Прибыль примечание",
		50,
		"Сотрудники примечание",
		2000000.0,
		"Обязательства примечание",
		"Комплекс описание",
		"Дополнительная информация",
		"Рекомендации",
		"Форма реализации",
		"Цель продажи",
		"Ключевые условия",
		"Дополнительные условия",
	)

	require.NoError(t, err)
	assert.NotNil(t, e)
	assert.Equal(t, "ТОО «Тест»", e.GetName())
	assert.Equal(t, "г. Алматы", e.GetLocation())
	assert.Equal(t, "IT", e.GetIndustry())
	assert.Equal(t, 100.0, e.GetGovernmentShare())
	assert.Equal(t, "ТОО", e.GetJuridicalForm())
	assert.Equal(t, 2020, e.GetYear())
	assert.Equal(t, 50, e.GetNumberOfEmployees())
	assert.Equal(t, 1000000.0, e.GetAuthorizedCapital())
}

func TestEnterprise_NewEnterprise_ValidationErrors(t *testing.T) {
	tests := []struct {
		name            string
		enterpriseName  string
		location        string
		industry        string
		governmentShare float64
		wantErr         bool
	}{
		{
			name:            "valid enterprise",
			enterpriseName:  "ТОО «Тест»",
			location:        "г. Алматы",
			industry:        "IT",
			governmentShare: 51.0,
			wantErr:         false,
		},
		{
			name:            "empty name",
			enterpriseName:  "",
			location:        "г. Алматы",
			industry:        "IT",
			governmentShare: 51.0,
			wantErr:         true,
		},
		{
			name:            "empty location",
			enterpriseName:  "ТОО «Тест»",
			location:        "",
			industry:        "IT",
			governmentShare: 51.0,
			wantErr:         true,
		},
		{
			name:            "empty industry",
			enterpriseName:  "ТОО «Тест»",
			location:        "г. Алматы",
			industry:        "",
			governmentShare: 51.0,
			wantErr:         true,
		},
		{
			name:            "negative government share",
			enterpriseName:  "ТОО «Тест»",
			location:        "г. Алматы",
			industry:        "IT",
			governmentShare: -1.0,
			wantErr:         true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e, err := enterprise.NewEnterprise(
				tt.enterpriseName,
				tt.location,
				tt.industry,
				tt.governmentShare,
				"", 0, "", "", 0, "", 0, "", 0, "", 0, "", 0, "", 0, "", 0, "", "", "", "", "", "", "", "",
			)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, e)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, e)
			}
		})
	}
}

func TestEnterprise_Update_Success(t *testing.T) {
	e, err := enterprise.NewEnterprise(
		"Старое название",
		"Старое место",
		"Старая отрасль",
		50.0,
		"АО", 2010, "Старый владелец", "Старая деятельность",
		500000, "", 1000000, "", 500000, "", 2000000, "", 100000, "", 25, "", 500000, "",
		"", "", "", "", "", "", "",
	)
	require.NoError(t, err)

	err = e.Update(
		"Новое название",
		"Новое место",
		"Новая отрасль",
		75.0,
		"ТОО",
		2025,
		"Новый владелец",
		"Новая деятельность",
		1000000,
		"Новый комментарий",
		2000000,
		"Активы обновлены",
		1000000,
		"Капитал обновлен",
		5000000,
		"Доход обновлен",
		500000,
		"Прибыль обновлена",
		100,
		"Сотрудники обновлены",
		1000000,
		"Обязательства обновлены",
		"Новый комплекс",
		"Новая инфо",
		"Новые рекомендации",
		"Новая форма",
		"Новая цель",
		"Новые условия",
		"Новые доп условия",
	)

	assert.NoError(t, err)
	assert.Equal(t, "Новое название", e.GetName())
	assert.Equal(t, "Новое место", e.GetLocation())
	assert.Equal(t, "Новая отрасль", e.GetIndustry())
	assert.Equal(t, 75.0, e.GetGovernmentShare())
	assert.Equal(t, "ТОО", e.GetJuridicalForm())
	assert.Equal(t, 2025, e.GetYear())
	assert.Equal(t, 100, e.GetNumberOfEmployees())
	assert.Equal(t, 1000000.0, e.GetAuthorizedCapital())
	assert.Equal(t, "Новый комментарий", e.GetAuthorizedCapitalComment())
}

func TestEnterprise_AllGetters(t *testing.T) {
	e, err := enterprise.NewEnterprise(
		"Тест",
		"Локация",
		"Отрасль",
		100.0,
		"Форма",
		2020,
		"Владелец",
		"Деятельность",
		1000000,
		"Капитал комментарий",
		2000000,
		"Активы комментарий",
		1500000,
		"Капитал комментарий",
		3000000,
		"Доход комментарий",
		500000,
		"Прибыль комментарий",
		75,
		"Сотрудники комментарий",
		1000000,
		"Обязательства комментарий",
		"Комплекс",
		"Инфо",
		"Рекомендации",
		"Форма реализации",
		"Цель",
		"Условия",
		"Доп условия",
	)
	require.NoError(t, err)

	// Test all getters
	assert.Equal(t, "Тест", e.GetName())
	assert.Equal(t, "Локация", e.GetLocation())
	assert.Equal(t, "Отрасль", e.GetIndustry())
	assert.Equal(t, 100.0, e.GetGovernmentShare())
	assert.Equal(t, "Форма", e.GetJuridicalForm())
	assert.Equal(t, 2020, e.GetYear())
	assert.Equal(t, "Владелец", e.GetOwner())
	assert.Equal(t, "Деятельность", e.GetMainActivity())
	assert.Equal(t, 1000000.0, e.GetAuthorizedCapital())
	assert.Equal(t, "Капитал комментарий", e.GetAuthorizedCapitalComment())
	assert.Equal(t, 2000000.0, e.GetAssets())
	assert.Equal(t, "Активы комментарий", e.GetAssetsComment())
	assert.Equal(t, 1500000.0, e.GetEquity())
	assert.Equal(t, "Капитал комментарий", e.GetEquityComment())
	assert.Equal(t, 3000000.0, e.GetIncome())
	assert.Equal(t, "Доход комментарий", e.GetIncomeComment())
	assert.Equal(t, 500000.0, e.GetNetProfit())
	assert.Equal(t, "Прибыль комментарий", e.GetNetProfitComment())
	assert.Equal(t, 75, e.GetNumberOfEmployees())
	assert.Equal(t, "Сотрудники комментарий", e.GetNumberOfEmployeesComment())
	assert.Equal(t, 1000000.0, e.GetTotalLiabilities())
	assert.Equal(t, "Обязательства комментарий", e.GetTotalLiabilitiesComment())
	assert.Equal(t, "Комплекс", e.GetPropertyComplex())
	assert.Equal(t, "Инфо", e.GetAdditionalInfo())
	assert.Equal(t, "Рекомендации", e.GetSalesRecommendations())
	assert.Equal(t, "Форма реализации", e.GetImplementationForm())
	assert.Equal(t, "Цель", e.GetSalePurpose())
	assert.Equal(t, "Условия", e.GetKeyTerms())
	assert.Equal(t, "Доп условия", e.GetAdditionalTerms())
	assert.NotZero(t, e.GetCreatedAt())
	assert.NotZero(t, e.GetUpdatedAt())
}

