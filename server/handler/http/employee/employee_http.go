package employee

import (
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/pkg/logger"
	employeeService "github.com/nnniyaz/nop/server/service/employee"
	"net/http"
)

type HttpDelivery struct {
	logger  logger.Logger
	service employeeService.EmployeeService
}

func NewHttpDelivery(l logger.Logger, service employeeService.EmployeeService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Employee struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Group string `json:"group"`
}

func NewEmployee(employee employee.Employee) *Employee {
	return &Employee{
		Id:    employee.GetID().String(),
		Name:  employee.GetName(),
		Group: employee.GetGroup(),
	}
}

type Employees struct {
	Employees []*Employee `json:"employees"`
	Count     int         `json:"count"`
}

func NewEmployees(employees []*employee.Employee) *Employees {
	var employeesList []*Employee
	for _, e := range employees {
		employeesList = append(employeesList, NewEmployee(*e))
	}
	return &Employees{
		employeesList,
		len(employeesList),
	}
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

func (hd *HttpDelivery) GetEmployees(w http.ResponseWriter, r *http.Request) {
	foundEmployees, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEmployees(foundEmployees))
}

func (hd *HttpDelivery) GetEmployeeById(w http.ResponseWriter, r *http.Request) {
	employeeId := chi.URLParam(r, "employee_id")
	foundEmployee, err := hd.service.GetById(r.Context(), employeeId)
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEmployee(*foundEmployee))
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

type CreateEmployeeIn struct {
	Name  string `json:"name"`
	Group string `json:"group"`
}

func (hd *HttpDelivery) CreateEmployee(w http.ResponseWriter, r *http.Request) {
	in := CreateEmployeeIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Create(r.Context(), in.Name, in.Group); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

type UpdateEmployeeIn struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Group string `json:"group"`
}

func (hd *HttpDelivery) UpdateEmployee(w http.ResponseWriter, r *http.Request) {
	in := UpdateEmployeeIn{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	if err := hd.service.Update(r.Context(), in.Id, in.Name, in.Group); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}

func (hd *HttpDelivery) DeleteEmployee(w http.ResponseWriter, r *http.Request) {
	employeeId := chi.URLParam(r, "employee_id")
	if err := hd.service.Delete(r.Context(), employeeId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
