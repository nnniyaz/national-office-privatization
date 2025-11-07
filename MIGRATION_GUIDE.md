# Migration Guide: i18n MlString & Enterprise Schema

## Обзор изменений

Этот релиз добавляет поддержку мультиязычности (казахский, русский, английский) и расширяет модель Enterprise.

### 1. Мультиязычная поддержка (MlString)

#### Затронутые сущности

Следующие поля были преобразованы в `MlString`:

- **Event**: `name`, `desc`
- **News**: `title`, `content`
- **Document**: `title`
- **NPA**: `title`
- **Mission**: `text`
- **Partner**: `name`
- **Employee**: `name`

#### Структура MlString

**Backend (Go):**
```go
type MlString struct {
    KZ string `json:"kz,omitempty" bson:"kz,omitempty"`
    RU string `json:"ru,omitempty" bson:"ru,omitempty"`
    EN string `json:"en,omitempty" bson:"en,omitempty"`
}
```

**Frontend (TypeScript):**
```typescript
type MlString = {
  kz?: string;
  ru?: string;
  en?: string;
};
```

#### API изменения

**Обратная совместимость:** API принимает как строки, так и объекты MlString:

```json
// Старый формат (автоматически преобразуется в {en: "..."})
{
  "title": "Simple string"
}

// Новый формат
{
  "title": {
    "kz": "Қазақша",
    "ru": "Русский",
    "en": "English"
  }
}
```

### 2. Расширенная схема Enterprise

Добавлено 24 новых поля для полного описания предприятий:

**Новые поля:**
- `juridicalForm` (string) - Организационно-правовая форма
- `year` (int) - Год основания
- `owner` (string) - Учредитель
- `mainActivity` (string) - Основная деятельность
- `authorizedCapital` (float64) - Уставный капитал
- `authorizedCapitalComment` (string) - Примечание
- `assets` (float64) - Активы
- `assetsComment` (string) - Примечание к активам
- `equity` (float64) - Собственный капитал
- `equityComment` (string) - Примечание
- `income` (float64) - Доход
- `incomeComment` (string) - Примечание к доходу
- `netProfit` (float64) - Чистая прибыль
- `netProfitComment` (string) - Примечание
- `numberOfEmployees` (int) - Количество сотрудников
- `numberOfEmployeesComment` (string) - Комментарий
- `totalLiabilities` (float64) - Совокупные обязательства
- `totalLiabilitiesComment` (string) - Комментарий
- `propertyComplex` (string) - Имущественный комплекс
- `additionalInfo` (string) - Дополнительная информация
- `salesRecommendations` (string) - Рекомендации по продажам
- `implementationForm` (string) - Форма реализации
- `salePurpose` (string) - Цель продажи
- `keyTerms` (string) - Ключевые условия
- `additionalTerms` (string) - Дополнительные условия

## Миграция базы данных

### MongoDB

#### 1. Миграция полей на MlString

Для существующих записей необходимо преобразовать текстовые поля в формат MlString:

```javascript
// Миграция Events
db.event.find({}).forEach(function(doc) {
  db.event.updateOne(
    { _id: doc._id },
    {
      $set: {
        name: typeof doc.name === 'string' ? { en: doc.name } : doc.name,
        desc: typeof doc.desc === 'string' ? { en: doc.desc } : doc.desc
      }
    }
  );
});

// Миграция News
db.news.find({}).forEach(function(doc) {
  db.news.updateOne(
    { _id: doc._id },
    {
      $set: {
        title: typeof doc.title === 'string' ? { en: doc.title } : doc.title,
        content: typeof doc.content === 'string' ? { en: doc.content } : doc.content
      }
    }
  );
});

// Миграция Documents
db.document.find({}).forEach(function(doc) {
  db.document.updateOne(
    { _id: doc._id },
    {
      $set: {
        title: typeof doc.title === 'string' ? { en: doc.title } : doc.title
      }
    }
  );
});

// Миграция NPA
db.npa.find({}).forEach(function(doc) {
  db.npa.updateOne(
    { _id: doc._id },
    {
      $set: {
        title: typeof doc.title === 'string' ? { en: doc.title } : doc.title
      }
    }
  );
});

// Миграция Partners
db.partner.find({}).forEach(function(doc) {
  db.partner.updateOne(
    { _id: doc._id },
    {
      $set: {
        name: typeof doc.name === 'string' ? { en: doc.name } : doc.name
      }
    }
  );
});

// Миграция Employees
db.employee.find({}).forEach(function(doc) {
  db.employee.updateOne(
    { _id: doc._id },
    {
      $set: {
        name: typeof doc.name === 'string' ? { en: doc.name } : doc.name
      }
    }
  );
});

// Миграция Mission
db.mission.findOne({}, function(err, doc) {
  if (doc) {
    db.mission.updateOne(
      { _id: doc._id },
      {
        $set: {
          text: typeof doc.text === 'string' ? { en: doc.text } : doc.text
        }
      }
    );
  }
});
```

#### 2. Миграция Enterprise

Добавить новые поля с значениями по умолчанию:

```javascript
db.enterprise.updateMany(
  {},
  {
    $set: {
      juridicalForm: "",
      year: 0,
      owner: "",
      mainActivity: "",
      authorizedCapital: 0,
      authorizedCapitalComment: "",
      assets: 0,
      assetsComment: "",
      equity: 0,
      equityComment: "",
      income: 0,
      incomeComment: "",
      netProfit: 0,
      netProfitComment: "",
      numberOfEmployees: 0,
      numberOfEmployeesComment: "",
      totalLiabilities: 0,
      totalLiabilitiesComment: "",
      propertyComplex: "",
      additionalInfo: "",
      salesRecommendations: "",
      implementationForm: "",
      salePurpose: "",
      keyTerms: "",
      additionalTerms: ""
    }
  }
);
```

### PostgreSQL/другие SQL БД

Если вы планируете переход с MongoDB на PostgreSQL:

#### 1. Создание типа MlString

```sql
-- Использовать JSONB для MlString
CREATE TYPE mlstring AS (
    kz TEXT,
    ru TEXT,
    en TEXT
);

-- Или просто использовать JSONB напрямую
```

#### 2. Таблица Events

```sql
ALTER TABLE events
  ALTER COLUMN name TYPE JSONB USING jsonb_build_object('en', name),
  ALTER COLUMN desc TYPE JSONB USING jsonb_build_object('en', desc);
```

#### 3. Таблица News

```sql
ALTER TABLE news
  ALTER COLUMN title TYPE JSONB USING jsonb_build_object('en', title),
  ALTER COLUMN content TYPE JSONB USING jsonb_build_object('en', content);
```

#### 4. Таблица Documents

```sql
ALTER TABLE documents
  ALTER COLUMN title TYPE JSONB USING jsonb_build_object('en', title);
```

#### 5. Таблица NPA

```sql
ALTER TABLE npa
  ALTER COLUMN title TYPE JSONB USING jsonb_build_object('en', title);
```

#### 6. Таблица Partners

```sql
ALTER TABLE partners
  ALTER COLUMN name TYPE JSONB USING jsonb_build_object('en', name);
```

#### 7. Таблица Employees

```sql
ALTER TABLE employees
  ALTER COLUMN name TYPE JSONB USING jsonb_build_object('en', name);
```

#### 8. Таблица Mission

```sql
ALTER TABLE mission
  ALTER COLUMN text TYPE JSONB USING jsonb_build_object('en', text);
```

#### 9. Таблица Enterprise

```sql
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS juridical_form TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS owner TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS main_activity TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS authorized_capital DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS authorized_capital_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS assets DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS assets_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS equity DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS equity_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS income DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS income_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS net_profit DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS net_profit_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS number_of_employees INTEGER;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS number_of_employees_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS total_liabilities DOUBLE PRECISION;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS total_liabilities_comment TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS property_complex TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS additional_info TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS sales_recommendations TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS implementation_form TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS sale_purpose TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS key_terms TEXT;
ALTER TABLE enterprises ADD COLUMN IF NOT EXISTS additional_terms TEXT;
```

## Rollback (откат изменений)

### Откат MlString к String

Если необходимо откатить изменения:

```javascript
// MongoDB: Взять значение из en
db.event.find({}).forEach(function(doc) {
  db.event.updateOne(
    { _id: doc._id },
    {
      $set: {
        name: doc.name?.en || doc.name?.ru || doc.name?.kz || '',
        desc: doc.desc?.en || doc.desc?.ru || doc.desc?.kz || ''
      }
    }
  );
});

// Аналогично для других коллекций
```

## Тестирование

### 1. Backend

```bash
cd server
bash scripts/test_server.sh
```

### 2. Admin Frontend

```bash
cd admin
npm install
npm run build
```

### 3. Client Frontend

```bash
cd client
npm install
npm run build
```

## API Examples

### Создание события с мультиязычным содержимым

```bash
POST /api/event
{
  "name": {
    "kz": "Жаңа оқиға",
    "ru": "Новое событие",
    "en": "New Event"
  },
  "desc": {
    "kz": "Сипаттама",
    "ru": "Описание",
    "en": "Description"
  },
  "imgUrl": "/images/event.jpg",
  "plannedAt": "2025-12-01T10:00:00Z"
}
```

### Создание предприятия с полными данными

```bash
POST /api/enterprise
{
  "name": "ТОО «ПНХЗ»",
  "location": "Республика Казахстан, г. Павлодар",
  "industry": "Нефтегазовая отрасль",
  "governmentShare": 100.0,
  "juridicalForm": "Товарищество с ограниченной ответственностью",
  "year": 1995,
  "owner": "100% акций принадлежат АО «НК «КазМунайГаз»",
  "mainActivity": "Переработка нефти",
  "authorizedCapital": 23846240.00,
  "authorizedCapitalComment": "По данным 2023 года",
  "assets": 150000000.00,
  "assetsComment": "Согласно госреестру",
  "equity": 80000000.00,
  "equityComment": "На конец 2023 года",
  "income": 250000000.00,
  "incomeComment": "Годовой доход 2023",
  "netProfit": 35000000.00,
  "netProfitComment": "Чистая прибыль 2023",
  "numberOfEmployees": 1500,
  "numberOfEmployeesComment": "По данным с сайта",
  "totalLiabilities": 70000000.00,
  "totalLiabilitiesComment": "Включая долгосрочные",
  "propertyComplex": "Технологическое оборудование, здания, сооружения...",
  "additionalInfo": "Крупнейшее предприятие на северо-востоке...",
  "salesRecommendations": "Открытый двухэтапный конкурс, 2028 год",
  "implementationForm": "Продажа 100% доли стратегическому инвестору",
  "salePurpose": "Привлечение инвестиций для модернизации",
  "keyTerms": "Комплексный аудит, бизнес-план",
  "additionalTerms": "Реструктуризация долговых обязательств"
}
```

## Обновление фронтенда

### Admin (React + Vite)

1. Используйте компонент `MlStringInput` для полей с MlString:

```tsx
import { MlStringInput } from '@/shared/ui/MlStringInput';

<MlStringInput
  label="Название"
  value={formData.title}
  onChange={(v) => setFormData({ ...formData, title: v })}
  required
/>
```

2. Для отображения используйте `tPick`:

```tsx
import { tPick } from '@/shared/i18n/types';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';

const { lang } = useTypedSelector(state => state.system);
const title = tPick(news.title, lang);
```

### Client (Next.js)

1. Используйте `tPick` для рендеринга:

```tsx
import { tPick } from '@/shared/i18n/types';
import { useParams } from 'next/navigation';

export default function NewsPage() {
  const params = useParams();
  const lang = params.lang as 'kz' | 'ru' | 'en';
  
  return <h1>{tPick(news.title, lang)}</h1>;
}
```

## Справочные данные

### Регионы Казахстана

Добавлен справочник регионов в `shared/data/kzRegions.ts`:

```typescript
import { KZ_REGIONS } from '@/shared/data/kzRegions';

<select>
  {KZ_REGIONS.map(region => (
    <option key={region} value={region}>{region}</option>
  ))}
</select>
```

## Затронутые файлы

### Server (Go)
- `server/internal/i18n/mlstring.go` - новый тип MlString
- `server/domain/*/` - обновлены доменные модели
- `server/service/*/` - обновлены сервисы
- `server/handler/http/*/` - обновлены HTTP-обработчики + Swagger
- `server/repo/mongo/*/` - обновлены репозитории

### Admin (React)
- `admin/src/shared/i18n/types.ts` - реэкспорт shared типов
- `admin/src/shared/ui/MlStringInput/` - новый компонент
- `admin/src/domain/*/` - обновлены TypeScript типы

### Client (Next.js)
- `client/src/shared/i18n/types.ts` - реэкспорт shared типов
- `client/src/domain/*/` - обновлены TypeScript типы

### Shared
- `shared/i18n/types.ts` - общие типы и утилиты
- `shared/data/kzRegions.ts` - справочник регионов

## Важные замечания

1. **Обратная совместимость**: Сервер автоматически конвертирует простые строки в `{en: "..."}` при десериализации JSON
2. **Валидация**: Требуется хотя бы один язык (kz, ru или en) для всех MlString полей
3. **Fallback**: Функция `tPick` автоматически выбирает доступный язык если запрошенный отсутствует
4. **БД**: MongoDB хранит MlString как вложенные объекты без дополнительной конфигурации

## Следующие шаги

1. Выполнить миграцию БД (см. скрипты выше)
2. Обновить формы в admin для использования MlStringInput
3. Обновить компоненты client для использования tPick при рендеринге
4. Заполнить новые поля Enterprise в существующих записях
5. Обновить UI админки для работы с расширенной схемой Enterprise

## Поддержка

При возникновении проблем проверьте:
- Совместимость версий в package.json
- Настройки TypeScript paths в tsconfig.json
- Формат данных в API запросах/ответах

