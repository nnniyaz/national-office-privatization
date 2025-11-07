# Swagger Annotations for All Endpoints

This file contains all Swagger annotations that need to be added to HTTP handlers.

## News Endpoints

### GetNews
```go
// GetNews godoc
// @Summary Get all news
// @Description Retrieves a list of all news articles with multilingual title and content
// @Tags news
// @Accept json
// @Produce json
// @Success 200 {object} NewsList
// @Failure 500 {object} ErrorResponse
// @Router /api/news [get]
// @Security Bearer
```

### GetNewsById
```go
// GetNewsById godoc
// @Summary Get news by ID
// @Description Retrieves a single news article by its ID
// @Tags news
// @Accept json
// @Produce json
// @Param news_id path string true "News ID"
// @Success 200 {object} News
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/news/{news_id} [get]
// @Security Bearer
```

### CreateNews
```go
// CreateNews godoc
// @Summary Create a new news article
// @Description Creates a new news article with multilingual title and content
// @Tags news
// @Accept json
// @Produce json
// @Param news body CreateNewsIn true "News data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/news [post]
// @Security Bearer
```

### UpdateNews
```go
// UpdateNews godoc
// @Summary Update a news article
// @Description Updates an existing news article
// @Tags news
// @Accept json
// @Produce json
// @Param news body UpdateNewsIn true "News update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/news [put]
// @Security Bearer
```

### DeleteNews
```go
// DeleteNews godoc
// @Summary Delete a news article
// @Description Deletes a news article by ID
// @Tags news
// @Accept json
// @Produce json
// @Param news_id path string true "News ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/news/{news_id} [delete]
// @Security Bearer
```

## Mission Endpoints

### GetMission
```go
// GetMission godoc
// @Summary Get mission
// @Description Retrieves the mission statement with multilingual text
// @Tags mission
// @Accept json
// @Produce json
// @Success 200 {object} Mission
// @Failure 500 {object} ErrorResponse
// @Router /api/mission [get]
```

### CreateMission
```go
// CreateMission godoc
// @Summary Create mission
// @Description Creates a new mission statement
// @Tags mission
// @Accept json
// @Produce json
// @Param mission body CreateMissionIn true "Mission data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/mission [post]
// @Security Bearer
```

### UpdateMission
```go
// UpdateMission godoc
// @Summary Update mission
// @Description Updates the mission statement
// @Tags mission
// @Accept json
// @Produce json
// @Param mission body UpdateMissionIn true "Mission update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/mission [put]
// @Security Bearer
```

## Partner Endpoints

### GetPartners
```go
// GetPartners godoc
// @Summary Get all partners
// @Description Retrieves a list of all partners with multilingual names
// @Tags partners
// @Accept json
// @Produce json
// @Success 200 {object} Partners
// @Failure 500 {object} ErrorResponse
// @Router /api/partner [get]
```

### GetPartnerById
```go
// GetPartnerById godoc
// @Summary Get partner by ID
// @Description Retrieves a single partner by its ID
// @Tags partners
// @Accept json
// @Produce json
// @Param partner_id path string true "Partner ID"
// @Success 200 {object} Partner
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/partner/{partner_id} [get]
// @Security Bearer
```

### CreatePartner
```go
// CreatePartner godoc
// @Summary Create a new partner
// @Description Creates a new partner with multilingual name
// @Tags partners
// @Accept json
// @Produce json
// @Param partner body CreatePartnerIn true "Partner data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/partner [post]
// @Security Bearer
```

### UpdatePartner
```go
// UpdatePartner godoc
// @Summary Update a partner
// @Description Updates an existing partner
// @Tags partners
// @Accept json
// @Produce json
// @Param partner body UpdatePartnerIn true "Partner update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/partner [put]
// @Security Bearer
```

### DeletePartner
```go
// DeletePartner godoc
// @Summary Delete a partner
// @Description Deletes a partner by ID
// @Tags partners
// @Accept json
// @Produce json
// @Param partner_id path string true "Partner ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/partner/{partner_id} [delete]
// @Security Bearer
```

## Employee Endpoints

### GetEmployees
```go
// GetEmployees godoc
// @Summary Get all employees
// @Description Retrieves a list of all employees with multilingual names
// @Tags employees
// @Accept json
// @Produce json
// @Success 200 {object} Employees
// @Failure 500 {object} ErrorResponse
// @Router /api/employee [get]
// @Security Bearer
```

### GetEmployeeById
```go
// GetEmployeeById godoc
// @Summary Get employee by ID
// @Description Retrieves a single employee by ID
// @Tags employees
// @Accept json
// @Produce json
// @Param employee_id path string true "Employee ID"
// @Success 200 {object} Employee
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/employee/{employee_id} [get]
// @Security Bearer
```

### CreateEmployee
```go
// CreateEmployee godoc
// @Summary Create a new employee
// @Description Creates a new employee with multilingual name
// @Tags employees
// @Accept json
// @Produce json
// @Param employee body CreateEmployeeIn true "Employee data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/employee [post]
// @Security Bearer
```

### UpdateEmployee
```go
// UpdateEmployee godoc
// @Summary Update an employee
// @Description Updates an existing employee
// @Tags employees
// @Accept json
// @Produce json
// @Param employee body UpdateEmployeeIn true "Employee update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/employee [put]
// @Security Bearer
```

### DeleteEmployee
```go
// DeleteEmployee godoc
// @Summary Delete an employee
// @Description Deletes an employee by ID
// @Tags employees
// @Accept json
// @Produce json
// @Param employee_id path string true "Employee ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/employee/{employee_id} [delete]
// @Security Bearer
```

## Enterprise Endpoints

### GetEnterprises
```go
// GetEnterprises godoc
// @Summary Get all enterprises
// @Description Retrieves a paginated list of enterprises with search, region, and field filters
// @Tags enterprises
// @Accept json
// @Produce json
// @Param offset query int false "Offset for pagination" default(0)
// @Param limit query int false "Limit for pagination" default(10)
// @Param search query string false "Search by name"
// @Param region query string false "Filter by region/location"
// @Param field query string false "Filter by industry"
// @Success 200 {object} Enterprises
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [get]
```

### GetEnterpriseById
```go
// GetEnterpriseById godoc
// @Summary Get enterprise by ID
// @Description Retrieves a single enterprise with full details
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise_id path string true "Enterprise ID"
// @Success 200 {object} Enterprise
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise/{enterprise_id} [get]
```

### CreateEnterprise
```go
// CreateEnterprise godoc
// @Summary Create a new enterprise
// @Description Creates a new enterprise with complete financial and operational data
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise body CreateEnterpriseIn true "Enterprise data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [post]
// @Security Bearer
```

### UpdateEnterprise
```go
// UpdateEnterprise godoc
// @Summary Update an enterprise
// @Description Updates an existing enterprise with new data
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise body UpdateEnterpriseIn true "Enterprise update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise [put]
// @Security Bearer
```

### DeleteEnterprise
```go
// DeleteEnterprise godoc
// @Summary Delete an enterprise
// @Description Deletes an enterprise by ID
// @Tags enterprises
// @Accept json
// @Produce json
// @Param enterprise_id path string true "Enterprise ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/enterprise/{enterprise_id} [delete]
// @Security Bearer
```

## NPA Endpoints

### GetNpas
```go
// GetNpas godoc
// @Summary Get all NPAs
// @Description Retrieves a list of all normative legal acts with multilingual titles
// @Tags npa
// @Accept json
// @Produce json
// @Success 200 {object} Npas
// @Failure 500 {object} ErrorResponse
// @Router /api/npa [get]
```

### GetNpaById
```go
// GetNpaById godoc
// @Summary Get NPA by ID
// @Description Retrieves a single NPA by its ID
// @Tags npa
// @Accept json
// @Produce json
// @Param npa_id path string true "NPA ID"
// @Success 200 {object} Npa
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/npa/{npa_id} [get]
```

### CreateNpa
```go
// CreateNpa godoc
// @Summary Create a new NPA
// @Description Creates a new normative legal act
// @Tags npa
// @Accept json
// @Produce json
// @Param npa body CreateNpaIn true "NPA data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/npa [post]
// @Security Bearer
```

### UpdateNpa
```go
// UpdateNpa godoc
// @Summary Update an NPA
// @Description Updates an existing normative legal act
// @Tags npa
// @Accept json
// @Produce json
// @Param npa body UpdateNpaIn true "NPA update data"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/npa [put]
// @Security Bearer
```

### DeleteNpa
```go
// DeleteNpa godoc
// @Summary Delete an NPA
// @Description Deletes a normative legal act by ID
// @Tags npa
// @Accept json
// @Produce json
// @Param npa_id path string true "NPA ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/npa/{npa_id} [delete]
// @Security Bearer
```

