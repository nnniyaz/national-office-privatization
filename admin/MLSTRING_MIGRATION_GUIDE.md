# MlString Migration Guide для Admin Frontend

## ✅ Что уже готово

1. **Shared UI компонент**: `MlStringInput` создан и готов к использованию
2. **Domain types**: Все типы обновлены с `MlString` (`News`, `Event`, `Partner`, `Employee`, `Mission`, `Document`)
3. **Пример реализации**: Document формы (Create/Edit) уже обновлены

## 🔧 Шаги для обновления форм

### Шаг 1: Обновить импорты

```typescript
// Добавить импорты
import MlStringInput from "../../../../shared/ui/MlStringInput/MlStringInput.tsx";
import type {MlString} from "../../../../shared/i18n/types.ts";

// Убрать Input из антдизайна (если использовался для MlString полей)
import {Button, Card, Form} from "antd"; // без Input
```

### Шаг 2: Заменить Input на MlStringInput

**Было:**
```typescript
<Form.Item
    label={translate("title", lang)}
    name={"title"}
    rules={[{required: true, message: translate("please_enter_title", lang)}]}
>
    <Input placeholder={translate("enter_title", lang)}/>
</Form.Item>
```

**Стало:**
```typescript
<Form.Item
    label=""
    name={"title"}
    rules={[{
        required: true,
        validator: (_, value: MlString) => {
            if (!value || (!value.kz && !value.ru && !value.en)) {
                return Promise.reject(translate("please_enter_title", lang));
            }
            return Promise.resolve();
        }
    }]}
>
    <MlStringInput
        label={translate("title", lang)}
        value={form.getFieldValue("title") || {}}
        onChange={(v) => form.setFieldValue("title", v)}
        required
        rows={2}  // или rows={5} для больших полей
    />
</Form.Item>
```

### Шаг 3: Обновить отображение в Edit формах

**Для отображения значения:**
```typescript
<p>{`${translate("title", lang)}: `}<i>{document?.title?.kz || document?.title?.ru || document?.title?.en || '-'}</i></p>
```

## 📋 Формы требующие обновления

### ✅ Document (ГОТОВО)
- `/admin/src/pages/Document/pages/DocumentCreate/DocumentCreate.tsx`
- `/admin/src/pages/Document/pages/DocumentEdit/DocumentEdit.tsx`

### ✅ Mission (ГОТОВО)
- `/admin/src/pages/Mission/Mission.tsx` - исправлено отображение
- `/admin/src/pages/Mission/pages/MissionCreate/MissionCreate.tsx`
- `/admin/src/pages/Mission/pages/MissionEdit/MissionEdit.tsx`

### ⏳ News
**Поля для обновления:** `title`, `content`

- `/admin/src/pages/News/pages/NewsCreate/NewsCreate.tsx`
- `/admin/src/pages/News/pages/NewsEdit/NewsEdit.tsx`

### ⏳ Event
**Поля для обновления:** `name`, `desc`

- `/admin/src/pages/Event/pages/EventCreate/EventCreate.tsx`
- `/admin/src/pages/Event/pages/EventEdit/EventEdit.tsx`

### ⏳ Partner
**Поля для обновления:** `name`

- `/admin/src/pages/Partner/pages/PartnerCreate/PartnerCreate.tsx`
- `/admin/src/pages/Partner/pages/PartnerEdit/PartnerEdit.tsx`

### ⏳ Employee
**Поля для обновления:** `name`

- `/admin/src/pages/Employee/pages/EmployeeCreate/EmployeeCreate.tsx`
- `/admin/src/pages/Employee/pages/EmployeeEdit/EmployeeEdit.tsx`

### ⏳ Mission
**Поля для обновления:** `text`

- `/admin/src/pages/Mission/Mission.tsx` (Create/Edit в одном файле)

## 🎯 Примечания

1. **Validation**: Используйте custom validator для проверки что хотя бы один язык заполнен
2. **rows**: Для коротких полей (title, name) используйте `rows={2}`, для длинных (content, description) - `rows={5-8}`
3. **required**: Не забывайте флаг `required` в MlStringInput для визуальной индикации

## 🚀 Backend уже готов!

Server API полностью поддерживает MlString и принимает объекты вида:
```json
{
  "title": {
    "kz": "Қазақша мәтін",
    "ru": "Русский текст",
    "en": "English text"
  }
}
```

Также поддерживается обратная совместимость со строками (автоматически конвертируются в `{en: "..."}`)

