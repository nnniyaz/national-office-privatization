# HTTP Integration Tests

Интеграционные тесты для REST API слоя.

## Описание

Эти тесты проверяют HTTP хендлеры через `httptest`, используя in-memory репозитории вместо реальной базы данных. Middleware (auth, rate-limit) отключены для упрощения тестирования.

## Структура

**Mock репозитории (7 файлов):**
- `mock_document_repo.go`
- `mock_news_repo.go`
- `mock_event_repo.go`
- `mock_partner_repo.go`
- `mock_employee_repo.go`
- `mock_mission_repo.go`
- `mock_enterprise_repo.go`

**HTTP тесты (7 файлов):**
- `document_http_test.go` - 10 тестов
- `news_http_test.go` - 7 тестов
- `event_http_test.go` - 4 теста
- `partner_http_test.go` - 5 тестов
- `employee_http_test.go` - 4 теста
- `mission_http_test.go` - 3 теста
- `enterprise_http_test.go` - 4 теста

**Всего: 37 интеграционных HTTP тестов**

## Покрытие API

### Document API (10 тестов)

### POST /api/document

- ✅ Успешное создание документа с MlString
- ✅ Обратная совместимость: создание с простой строкой
- ✅ Негативные кейсы: пустой title, пустой filename, невалидный JSON

### GET /api/document

- ✅ Получение списка всех документов

### GET /api/document/:id

- ✅ Получение документа по ID

### PUT /api/document

- ✅ Успешное обновление документа
- ✅ Негативный кейс: обновление с пустым filename

### DELETE /api/document/:id

- ✅ Успешное удаление документа
- ✅ Проверка удаления (404/500)

### News API (7 тестов)

- ✅ POST: создание новости с мультиязычными title/content
- ✅ POST: валидация пустого title
- ✅ POST: валидация пустого content
- ✅ GET: получение списка новостей
- ✅ GET /:id: получение новости по ID
- ✅ PUT: обновление новости
- ✅ DELETE: удаление новости

### Event API (4 теста)

- ✅ POST: создание события с plannedAt
- ✅ GET: получение списка событий
- ✅ PUT: обновление события
- ✅ DELETE: удаление события

### Partner API (5 тестов)

- ✅ POST: создание партнёра
- ✅ POST: валидация пустого link
- ✅ GET: получение списка партнёров
- ✅ PUT: обновление партнёра
- ✅ DELETE: удаление партнёра

### Employee API (4 теста)

- ✅ POST: создание сотрудника
- ✅ GET: получение списка сотрудников
- ✅ PUT: обновление сотрудника
- ✅ DELETE: удаление сотрудника

### Mission API (3 теста)

- ✅ POST: создание миссии (singleton)
- ✅ GET: получение миссии
- ✅ PUT: обновление миссии

### Enterprise API (4 теста)

- ✅ POST: создание предприятия со всеми 27 полями
- ✅ GET: получение списка с пагинацией
- ✅ GET /:id: получение предприятия по ID
- ✅ DELETE: удаление предприятия

## Запуск

```bash
# Все интеграционные тесты
go test ./tests/integration/... -v

# Конкретный тест
go test ./tests/integration/... -v -run TestCreateDocument_HTTP

# С отображением покрытия
go test ./tests/integration/... -v -cover
```

## Добавление новых тестов

1. Создайте `mock_<entity>_repo.go` для нового entity
2. Создайте `<entity>_http_test.go` с тестами
3. Реализуйте `newTest<Entity>Handler(t *testing.T)` хелпер
4. Добавьте тесты для всех CRUD операций и негативных сценариев

## Отличия от E2E тестов

- **Integration tests** (`tests/integration/`): тестируют HTTP слой с mock репозиториями (37 тестов)
- **E2E tests** (`tests/e2e/`): тестируют доменную логику напрямую, без HTTP (61 тест)

**Общее покрытие: 98 тестов** ✅

Для полного покрытия используйте оба типа тестов.

## Статистика

```
$ go test ./tests/... -v
ok  	github.com/nnniyaz/nop/server/tests/e2e          (61 tests)
ok  	github.com/nnniyaz/nop/server/tests/integration  (37 tests)

Всего: 98 зелёных тестов 🎉
```

