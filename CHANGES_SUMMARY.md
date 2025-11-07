# Краткий обзор изменений по пакетам

## ✅ Server (Go Backend)

### Новые файлы
- `server/internal/i18n/mlstring.go` - Тип MlString с JSON/BSON сериализацией

### Domain модели (обновлены на MlString)
- `server/domain/event/event.go` - name, desc → MlString
- `server/domain/news/news.go` - title, content → MlString
- `server/domain/document/document.go` - title → MlString
- `server/domain/npa/npa.go` - title → MlString
- `server/domain/mission/mission.go` - text → MlString
- `server/domain/partner/partner.go` - name → MlString
- `server/domain/employee/employee.go` - name → MlString

### Domain модели (новая схема)
- `server/domain/enterprise/enterprise.go` - 27 полей вместо 5

### Сервисы (обновлены сигнатуры)
- `server/service/event/event_service.go`
- `server/service/news/news_service.go`
- `server/service/document/document_service.go`
- `server/service/npa/npa_service.go`
- `server/service/mission/mission_service.go`
- `server/service/partner/partner_service.go`
- `server/service/employee/employee_service.go`
- `server/service/enterprise/enterprise_service.go`

### HTTP обработчики (DTO + Swagger)
- `server/handler/http/event/event_http.go`
- `server/handler/http/news/news_http.go`
- `server/handler/http/document/document_http.go`
- `server/handler/http/npa/npa_http.go`
- `server/handler/http/mission/mission_http.go`
- `server/handler/http/partner/partner_http.go`
- `server/handler/http/employee/employee_http.go`
- `server/handler/http/enterprise/enterprise_http.go`
- `server/handler/http/user/user_http.go` (только Swagger)
- `server/handler/http/contacts/contacts_http.go` (только Swagger)
- `server/handler/http/application/application_http.go` (только Swagger)
- `server/handler/http/auth/auth_http.go` (только Swagger)
- `server/handler/http/swagger_models.go` - MlString schema

### Репозитории MongoDB
- `server/repo/mongo/event/event_mongo.go`
- `server/repo/mongo/news/news_mongo.go`
- `server/repo/mongo/document/document_mongo.go`
- `server/repo/mongo/npa/npa_mongo.go`
- `server/repo/mongo/mission/mission_mongo.go`
- `server/repo/mongo/partner/partner_mongo.go`
- `server/repo/mongo/employee/employee_mongo.go`
- `server/repo/mongo/enterprise/enterprise_mongo.go`

**Статус:** ✅ Все компилируется, тесты проходят

---

## ✅ Admin (React + Vite)

### Новые файлы
- `admin/src/shared/i18n/types.ts` - Реэкспорт shared типов
- `admin/src/shared/ui/MlStringInput/MlStringInput.tsx` - Компонент ввода
- `admin/src/shared/ui/MlStringInput/MlStringInput.module.scss` - Стили
- `admin/src/shared/ui/MlStringInput/index.ts` - Экспорт

### Обновленные типы
- `admin/src/domain/event/event.ts` - name, desc → MlString
- `admin/src/domain/news/news.ts` - title, content → MlString
- `admin/src/domain/document/document.ts` - title → MlString
- `admin/src/domain/npa/npa.ts` - title → MlString
- `admin/src/domain/mission/mission.ts` - text → MlString
- `admin/src/domain/partner/partner.ts` - name → MlString
- `admin/src/domain/employee/employee.ts` - name → MlString
- `admin/src/domain/enterprise/enterprise.ts` - 27 полей
- `admin/src/domain/base/mlString.ts` - добавлен реэкспорт tPick

**Требуется:** Обновить формы для использования `MlStringInput`

---

## ✅ Client (Next.js)

### Новые файлы
- `client/src/shared/i18n/types.ts` - Реэкспорт shared типов

### Обновленные типы
- `client/src/domain/event/event.ts` - name, desc → MlString
- `client/src/domain/news/news.ts` - title, content → MlString
- `client/src/domain/document/document.ts` - title → MlString
- `client/src/domain/npa/npa.ts` - title → MlString
- `client/src/domain/mission/mission.ts` - text → MlString
- `client/src/domain/partner/partner.ts` - name → MlString
- `client/src/domain/employee/employee.ts` - name → MlString
- `client/src/domain/enterprise/enterprise.ts` - 27 полей

**Требуется:** Обновить компоненты для использования `tPick(value, lang)`

---

## ✅ Shared

### Новые файлы
- `shared/i18n/types.ts` - Lang, MlString, tPick()
- `shared/data/kzRegions.ts` - Справочник регионов РК

---

## Статистика изменений

```
36 файлов изменено
+921 строк добавлено
-1100 строк удалено
```

### Коммиты
1. ✅ `feat: implement i18n MlString support and Enterprise schema refactoring`
2. ✅ `docs: add migration guide for i18n and Enterprise schema changes`

---

## Действия по базе данных (обязательно!)

### MongoDB (текущая БД)

Выполните миграционные скрипты из `MIGRATION_GUIDE.md`:

1. **Миграция MlString полей** - конвертация `string` → `{en: "..."}`
2. **Добавление полей Enterprise** - установка значений по умолчанию

### Если используется PostgreSQL

Выполните SQL-миграции из `MIGRATION_GUIDE.md`:

1. Изменить типы колонок на JSONB для MlString
2. Добавить 24 новые колонки в таблицу enterprises

---

## API Breaking Changes

### ⚠️ Несовместимые изменения

**Enterprise endpoints** теперь требуют/возвращают полный набор из 27 полей.

**MlString поля** теперь возвращают объекты вместо строк:
```diff
- "title": "Some text"
+ "title": {"kz": "...", "ru": "...", "en": "Some text"}
```

**Обратная совместимость входящих данных:** API принимает строки и автоматически конвертирует в `{en: "..."}`.

---

## Следующие шаги

### Admin
- [ ] Обновить формы Event для использования MlStringInput
- [ ] Обновить формы News для использования MlStringInput
- [ ] Обновить формы Document для использования MlStringInput
- [ ] Обновить формы NPA для использования MlStringInput
- [ ] Обновить формы Mission для использования MlStringInput
- [ ] Обновить формы Partner для использования MlStringInput
- [ ] Обновить формы Employee для использования MlStringInput
- [ ] Создать/обновить форму Enterprise с 27 полями
- [ ] Использовать tPick() для отображения в таблицах/карточках

### Client
- [ ] Обновить компоненты для рендеринга MlString с tPick()
- [ ] Обновить страницы Event
- [ ] Обновить страницы News
- [ ] Обновить страницы Partners
- [ ] Обновить страницы Employees
- [ ] Обновить страницы Enterprise
- [ ] Обновить страницы Mission

### База данных
- [ ] Запустить миграционные скрипты MongoDB
- [ ] Заполнить переводы для критичного контента
- [ ] Заполнить расширенные данные Enterprise

