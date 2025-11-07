package employee

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/nnniyaz/nop/server/domain/employee"
	"github.com/nnniyaz/nop/server/handler/http/response"
	"github.com/nnniyaz/nop/server/internal/i18n"
	"github.com/nnniyaz/nop/server/pkg/logger"
	employeeService "github.com/nnniyaz/nop/server/service/employee"
)

type HttpDelivery struct {
	logger  logger.Logger
	service employeeService.EmployeeService
}

func NewHttpDelivery(l logger.Logger, service employeeService.EmployeeService) *HttpDelivery {
	return &HttpDelivery{logger: l, service: service}
}

type Employee struct {
	Id    string        `json:"id"`
	Name  i18n.MlString `json:"name"`
	Group string        `json:"group"`
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

// GetEmployees godoc
//
//	@Summary		Get all employees
//	@Description	Retrieves a list of all employees with multilingual names
//	@Tags			employees
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	Employees
//	@Failure		500	{object}	response.Error
//	@Router			/api/employee [get]
//	@Security		Bearer
func (hd *HttpDelivery) GetEmployees(w http.ResponseWriter, r *http.Request) {
	foundEmployees, err := hd.service.Get(r.Context())
	if err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, NewEmployees(foundEmployees))
}

// GetEmployeeById godoc
//
//	@Summary		Get employee by ID
//	@Description	Retrieves a single employee by ID
//	@Tags			employees
//	@Accept			json
//	@Produce		json
//	@Param			employee_id	path		string	true	"Employee ID"
//	@Success		200			{object}	Employee
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/employee/{employee_id} [get]
//	@Security		Bearer
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
	Name  i18n.MlString `json:"name"`
	Group string        `json:"group"`
}

// CreateEmployee godoc
//
//	@Summary		Create a new employee
//	@Description	Creates a new employee with multilingual name
//	@Tags			employees
//	@Accept			json
//	@Produce		json
//	@Param			employee	body		CreateEmployeeIn	true	"Employee data"
//	@Success		200			{object}	response.Success
//	@Failure		400			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/employee [post]
//	@Security		Bearer
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
	Id    string        `json:"id"`
	Name  i18n.MlString `json:"name"`
	Group string        `json:"group"`
}

// UpdateEmployee godoc
//
//	@Summary		Update an employee
//	@Description	Updates an existing employee
//	@Tags			employees
//	@Accept			json
//	@Produce		json
//	@Param			employee	body		UpdateEmployeeIn	true	"Employee update data"
//	@Success		200			{object}	response.Success
//	@Failure		400			{object}	response.Error
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/employee [put]
//	@Security		Bearer
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

// DeleteEmployee godoc
//
//	@Summary		Delete an employee
//	@Description	Deletes an employee by ID
//	@Tags			employees
//	@Accept			json
//	@Produce		json
//	@Param			employee_id	path		string	true	"Employee ID"
//	@Success		200			{object}	response.Success
//	@Failure		404			{object}	response.Error
//	@Failure		500			{object}	response.Error
//	@Router			/api/employee/{employee_id} [delete]
//	@Security		Bearer
func (hd *HttpDelivery) DeleteEmployee(w http.ResponseWriter, r *http.Request) {
	employeeId := chi.URLParam(r, "employee_id")
	if err := hd.service.Delete(r.Context(), employeeId); err != nil {
		response.NewError(hd.logger, w, r, err)
		return
	}
	response.NewSuccess(hd.logger, w, r, nil)
}
