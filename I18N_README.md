# Мультиязычная поддержка (i18n) и обновление Enterprise

## 🎯 Что сделано

### Backend (100% готово)
- ✅ Тип `i18n.MlString` с поддержкой kz/ru/en
- ✅ Автоматическая конвертация строк в `{en: "..."}`
- ✅ 7 сущностей мигрированы на MlString
- ✅ Enterprise расширен до 27 полей
- ✅ Swagger документация для всех API
- ✅ Все тесты проходят

### Frontend Types (100% готово)
- ✅ Shared типы Lang, MlString, tPick()
- ✅ TypeScript интерфейсы обновлены в admin
- ✅ TypeScript интерфейсы обновлены в client
- ✅ Компонент MlStringInput для admin
- ✅ Справочник регионов Казахстана

## 🚀 Быстрый старт

### 1. Миграция базы данных

**ВАЖНО:** Перед запуском приложения выполните миграцию!

```bash
# Откройте MongoDB shell
mongosh your_connection_string

# Скопируйте и выполните скрипты из MIGRATION_GUIDE.md
# Раздел "MongoDB" -> "Миграция полей на MlString"
```

### 2. Пример использования API

**Создание новости с переводами:**

```bash
curl -X POST http://localhost:8080/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": {
      "kz": "Жаңалық тақырыбы",
      "ru": "Заголовок новости",
      "en": "News Title"
    },
    "content": {
      "kz": "Мазмұн",
      "ru": "Содержание",
      "en": "Content"
    },
    "imgUrl": "/images/news.jpg"
  }'
```

**Получение данных** (возвращает MlString объекты):

```bash
curl http://localhost:8080/api/news
# Response:
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "...",
        "title": {
          "kz": "Жаңалық тақырыбы",
          "ru": "Заголовок новости",
          "en": "News Title"
        },
        ...
      }
    ],
    "count": 1
  }
}
```

### 3. Использование в Admin (React)

```tsx
import { MlStringInput } from '@/shared/ui/MlStringInput';
import { tPick } from '@/shared/i18n/types';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';

function NewsForm() {
  const [title, setTitle] = useState<MlString>({});
  const { lang } = useTypedSelector(state => state.system);

  return (
    <>
      {/* Ввод */}
      <MlStringInput
        label="Заголовок"
        value={title}
        onChange={setTitle}
        required
      />

      {/* Отображение */}
      <h1>{tPick(news.title, lang)}</h1>
    </>
  );
}
```

### 4. Использование в Client (Next.js)

```tsx
import { tPick } from '@/shared/i18n/types';

export default function NewsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as 'kz' | 'ru' | 'en';

  return (
    <div>
      <h1>{tPick(news.title, lang)}</h1>
      <p>{tPick(news.content, lang)}</p>
    </div>
  );
}
```

## 📖 Функция tPick (fallback)

Автоматически выбирает доступный перевод:

```typescript
// Приоритет: запрошенный язык -> kz -> ru -> en
tPick({ ru: "Текст", en: "Text" }, 'kz')  // "Текст" (fallback на ru)
tPick({ kz: "Мәтін" }, 'ru')               // "Мәтін" (fallback на kz)
tPick({}, 'en')                            // "" (пустая строка)
```

## 🏢 Enterprise - новые поля

### Финансовые показатели
- Уставный капитал (`authorizedCapital`) + комментарий
- Активы (`assets`) + комментарий
- Собственный капитал (`equity`) + комментарий
- Доход (`income`) + комментарий
- Чистая прибыль (`netProfit`) + комментарий
- Совокупные обязательства (`totalLiabilities`) + комментарий

### Операционные данные
- Количество сотрудников (`numberOfEmployees`) + комментарий
- Год основания (`year`)
- Учредитель (`owner`)
- Основная деятельность (`mainActivity`)
- Организационно-правовая форма (`juridicalForm`)

### Информация о продаже
- Имущественный комплекс (`propertyComplex`)
- Дополнительная информация (`additionalInfo`)
- Рекомендации по продажам (`salesRecommendations`)
- Форма реализации (`implementationForm`)
- Цель продажи (`salePurpose`)
- Ключевые условия (`keyTerms`)
- Дополнительные условия (`additionalTerms`)

## 🗂️ Регионы Казахстана

Используйте `KZ_REGIONS` из `shared/data/kzRegions.ts`:

```typescript
import { KZ_REGIONS } from '@/shared/data/kzRegions';

// В формах
<select name="location">
  <option value="">Выберите регион</option>
  {KZ_REGIONS.map(region => (
    <option key={region} value={region}>{region}</option>
  ))}
</select>
```

## 🔍 Swagger UI

После установки `swag`:

```bash
cd server
go install github.com/swaggo/swag/cmd/swag@latest
make swag
# Swagger UI доступен на /swagger/index.html
```

## ⚠️ Breaking Changes

1. **Enterprise API** - теперь требует/возвращает 27 полей
2. **MlString поля** - возвращают объекты вместо строк
3. **Формы admin** - требуют обновления под новые типы

## 📚 Дополнительные ресурсы

- `MIGRATION_GUIDE.md` - Детальное руководство по миграции
- `CHANGES_SUMMARY.md` - Полный список изменений
- `shared/i18n/types.ts` - Исходный код типов и утилит
- `server/internal/i18n/mlstring.go` - Server-side реализация

## ✨ Следующие шаги

1. **Обязательно:** Выполните миграцию БД (см. MIGRATION_GUIDE.md)
2. **Рекомендуется:** Обновите UI форм в admin для использования MlStringInput
3. **Рекомендуется:** Обновите компоненты client для использования tPick()
4. **Опционально:** Заполните переводы для существующего контента
5. **Опционально:** Заполните расширенные данные Enterprise

## 🐛 Известные проблемы

Пока нет. Если найдете - создайте issue.

## 📞 Вопросы

См. документацию:
- Backend: `server/internal/i18n/mlstring.go`
- Frontend: `shared/i18n/types.ts`
- Examples: `MIGRATION_GUIDE.md`

