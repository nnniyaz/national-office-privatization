package enterprise

import (
	"context"
	"time"

	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/enterprise"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RepoEnterprise struct {
	client *mongo.Client
}

func NewRepoEnterprise(client *mongo.Client) *RepoEnterprise {
	return &RepoEnterprise{client: client}
}

func (r *RepoEnterprise) Coll() *mongo.Collection {
	return r.client.Database("main").Collection("enterprise")
}

type mongoEnterprise struct {
	Id                       uuid.UUID `bson:"_id"`
	Name                     string    `bson:"name"`
	Location                 string    `bson:"location"`
	Industry                 string    `bson:"industry"`
	GovernmentShare          float64   `bson:"governmentShare"`
	JuridicalForm            string    `bson:"juridicalForm"`
	Year                     int       `bson:"year"`
	Owner                    string    `bson:"owner"`
	MainActivity             string    `bson:"mainActivity"`
	AuthorizedCapital        float64   `bson:"authorizedCapital"`
	AuthorizedCapitalComment string    `bson:"authorizedCapitalComment"`
	Assets                   float64   `bson:"assets"`
	AssetsComment            string    `bson:"assetsComment"`
	Equity                   float64   `bson:"equity"`
	EquityComment            string    `bson:"equityComment"`
	Income                   float64   `bson:"income"`
	IncomeComment            string    `bson:"incomeComment"`
	NetProfit                float64   `bson:"netProfit"`
	NetProfitComment         string    `bson:"netProfitComment"`
	NumberOfEmployees        int       `bson:"numberOfEmployees"`
	NumberOfEmployeesComment string    `bson:"numberOfEmployeesComment"`
	TotalLiabilities         float64   `bson:"totalLiabilities"`
	TotalLiabilitiesComment  string    `bson:"totalLiabilitiesComment"`
	PropertyComplex          string    `bson:"propertyComplex"`
	AdditionalInfo           string    `bson:"additionalInfo"`
	SalesRecommendations     string    `bson:"salesRecommendations"`
	ImplementationForm       string    `bson:"implementationForm"`
	SalePurpose              string    `bson:"salePurpose"`
	KeyTerms                 string    `bson:"keyTerms"`
	AdditionalTerms          string    `bson:"additionalTerms"`
	DocumentUrl              string    `bson:"documentUrl"`
	CreatedAt                time.Time `bson:"createdAt"`
	UpdatedAt                time.Time `bson:"updatedAt"`
}

func newFromEnterprise(e *enterprise.Enterprise) *mongoEnterprise {
	return &mongoEnterprise{
		Id:                       e.GetID(),
		Name:                     e.GetName(),
		Location:                 e.GetLocation(),
		Industry:                 e.GetIndustry(),
		GovernmentShare:          e.GetGovernmentShare(),
		JuridicalForm:            e.GetJuridicalForm(),
		Year:                     e.GetYear(),
		Owner:                    e.GetOwner(),
		MainActivity:             e.GetMainActivity(),
		AuthorizedCapital:        e.GetAuthorizedCapital(),
		AuthorizedCapitalComment: e.GetAuthorizedCapitalComment(),
		Assets:                   e.GetAssets(),
		AssetsComment:            e.GetAssetsComment(),
		Equity:                   e.GetEquity(),
		EquityComment:            e.GetEquityComment(),
		Income:                   e.GetIncome(),
		IncomeComment:            e.GetIncomeComment(),
		NetProfit:                e.GetNetProfit(),
		NetProfitComment:         e.GetNetProfitComment(),
		NumberOfEmployees:        e.GetNumberOfEmployees(),
		NumberOfEmployeesComment: e.GetNumberOfEmployeesComment(),
		TotalLiabilities:         e.GetTotalLiabilities(),
		TotalLiabilitiesComment:  e.GetTotalLiabilitiesComment(),
		PropertyComplex:          e.GetPropertyComplex(),
		AdditionalInfo:           e.GetAdditionalInfo(),
		SalesRecommendations:     e.GetSalesRecommendations(),
		ImplementationForm:       e.GetImplementationForm(),
		SalePurpose:              e.GetSalePurpose(),
		KeyTerms:                 e.GetKeyTerms(),
		AdditionalTerms:          e.GetAdditionalTerms(),
		DocumentUrl:              e.GetDocumentUrl(),
		CreatedAt:                e.GetCreatedAt(),
		UpdatedAt:                e.GetUpdatedAt(),
	}
}

func (m *mongoEnterprise) ToAggregate() *enterprise.Enterprise {
	return enterprise.UnmarshalEnterpriseFromDatabase(
		m.Id, m.Name, m.Location, m.Industry, m.GovernmentShare,
		m.JuridicalForm, m.Year, m.Owner, m.MainActivity,
		m.AuthorizedCapital, m.AuthorizedCapitalComment,
		m.Assets, m.AssetsComment, m.Equity, m.EquityComment,
		m.Income, m.IncomeComment, m.NetProfit, m.NetProfitComment,
		m.NumberOfEmployees, m.NumberOfEmployeesComment,
		m.TotalLiabilities, m.TotalLiabilitiesComment,
		m.PropertyComplex, m.AdditionalInfo, m.SalesRecommendations,
		m.ImplementationForm, m.SalePurpose, m.KeyTerms, m.AdditionalTerms, m.DocumentUrl,
		m.CreatedAt, m.UpdatedAt,
	)
}

func (r *RepoEnterprise) Get(ctx context.Context, offset, limit int64, search, region, field string) ([]*enterprise.Enterprise, int64, error) {
	var m []mongoEnterprise
	filter := bson.D{
		{"governmentShare", bson.D{{"$gt", -1}}},
	}
	if search != "" {
		filter = append(filter, bson.E{
			Key:   "name",
			Value: bson.D{{"$regex", primitive.Regex{Pattern: search, Options: "i"}}},
		})
	}

	if region != "" {
		filter = append(filter, bson.E{
			Key:   "location",
			Value: bson.D{{"$regex", primitive.Regex{Pattern: region, Options: "i"}}},
		})
	}

	if field != "" {
		filter = append(filter, bson.E{
			Key:   "industry",
			Value: bson.D{{"$regex", primitive.Regex{Pattern: field, Options: "i"}}},
		})
	}

	count, err := r.Coll().CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	cursor, err := r.Coll().Find(ctx, filter, options.Find().SetSort(bson.D{{"createdAt", -1}}).SetSkip(offset).SetLimit(limit))
	if err != nil {
		return nil, 0, err
	}
	if err := cursor.All(ctx, &m); err != nil {
		return nil, 0, err
	}

	var enterprises []*enterprise.Enterprise
	for _, v := range m {
		enterprises = append(enterprises, v.ToAggregate())
	}
	return enterprises, count, nil
}

func (r *RepoEnterprise) GetById(ctx context.Context, id uuid.UUID) (*enterprise.Enterprise, error) {
	var m mongoEnterprise
	err := r.Coll().FindOne(ctx, bson.M{"_id": id}).Decode(&m)
	if err != nil {
		return nil, err
	}
	return m.ToAggregate(), nil
}

func (r *RepoEnterprise) Create(ctx context.Context, e *enterprise.Enterprise) error {
	_, err := r.Coll().InsertOne(ctx, newFromEnterprise(e))
	return err
}

func (r *RepoEnterprise) Update(ctx context.Context, e *enterprise.Enterprise) error {
	_, err := r.Coll().UpdateOne(ctx, bson.M{"_id": e.GetID()}, bson.M{"$set": newFromEnterprise(e)})
	return err
}

func (r *RepoEnterprise) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.Coll().DeleteOne(ctx, bson.M{"_id": id})
	return err
}
