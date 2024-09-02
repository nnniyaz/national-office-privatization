package employee

import (
	"context"
	"github.com/nnniyaz/nop/server/domain/base/uuid"
	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/pkg/logger"
	"github.com/nnniyaz/nop/server/repo"
)

type EmployeeService interface {
	Get(ctx context.Context) ([]*employee.Employee, error)
	GetById(ctx context.Context, employeeId string) (*employee.Employee, error)
	Create(ctx context.Context, name, group string) error
	Update(ctx context.Context, employeeId, name, group string) error
	Delete(ctx context.Context, employeeId string) error
}

type employeeService struct {
	logger       logger.Logger
	employeeRepo repo.Employee
}

func NewEmployeeService(l logger.Logger, repo repo.Employee) EmployeeService {
	return &employeeService{logger: l, employeeRepo: repo}
}

func (s *employeeService) Get(ctx context.Context) ([]*employee.Employee, error) {
	return s.employeeRepo.Get(ctx)
}

func (s *employeeService) GetById(ctx context.Context, employeeId string) (*employee.Employee, error) {
	convertedId, err := uuid.UUIDFromString(employeeId)
	if err != nil {
		return nil, err
	}
	return s.employeeRepo.GetById(ctx, convertedId)
}

func (s *employeeService) Create(ctx context.Context, name, group string) error {
	e := employee.NewEmployee(name, group)
	return s.employeeRepo.Create(ctx, e)
}

func (s *employeeService) Update(ctx context.Context, employeeId, name, group string) error {
	convertedId, err := uuid.UUIDFromString(employeeId)
	if err != nil {
		return err
	}
	foundEmployee, err := s.employeeRepo.GetById(ctx, convertedId)
	if err != nil {
		return err
	}
	foundEmployee.Update(name, group)
	return s.employeeRepo.Update(ctx, foundEmployee)
}

func (s *employeeService) Delete(ctx context.Context, employeeId string) error {
	convertedId, err := uuid.UUIDFromString(employeeId)
	if err != nil {
		return err
	}
	return s.employeeRepo.Delete(ctx, convertedId)
}
