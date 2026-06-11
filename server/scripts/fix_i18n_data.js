// fix_i18n_data.js — исправление легаси i18n-данных в MongoDB (база "main").
//
// Что делает:
//   1. Во всех MlString-полях, где в `ru` лежит казахский текст (есть буквы әғқңөұүһі),
//      а `kz` пуст — переносит текст из `ru` в `kz`.
//   2. Удаляет дубликат новости от 2025-11-27 (ru-only копия 10859f26-...,
//      остаётся полная kz+ru версия 2bc6de41-...).
//
// Запуск (сначала ОБЯЗАТЕЛЬНО dry-run):
//   mongosh "$MONGO_URI" --file fix_i18n_data.js                  # dry-run, только отчёт
//   mongosh "$MONGO_URI" --eval "const APPLY=true" --file fix_i18n_data.js   # применить
//
// Перед применением сделайте бэкап: mongodump --uri "$MONGO_URI" --db main

const apply = typeof APPLY !== 'undefined' && APPLY === true;
const db_ = db.getSiblingDB('main');

const KAZAKH_RE = /[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/;

// Коллекции и их MlString-поля
const ML_FIELDS = {
  news: ['title', 'content'],
  event: ['name', 'desc'],
  document: ['title'],
  npa: ['title'],
  mission: ['text'],
  partner: ['name'],
  employee: ['name'],
};

print(`=== fix_i18n_data (${apply ? 'APPLY' : 'DRY-RUN'}) ===\n`);

// --- 1. Казахский текст в ru при пустом kz -> переносим в kz ---
let moved = 0;
for (const [coll, fields] of Object.entries(ML_FIELDS)) {
  db_.getCollection(coll).find({}).forEach((doc) => {
    const set = {};
    const unset = {};
    for (const f of fields) {
      const v = doc[f];
      if (!v || typeof v !== 'object') continue;
      const ru = v.ru || '';
      const kz = v.kz || '';
      if (ru && !kz && KAZAKH_RE.test(ru)) {
        set[`${f}.kz`] = ru;
        unset[`${f}.ru`] = '';
      }
    }
    if (Object.keys(set).length > 0) {
      moved++;
      print(`[ru->kz] ${coll} ${doc._id} : ${Object.keys(set).join(', ')}`);
      if (apply) {
        db_.getCollection(coll).updateOne(
          { _id: doc._id },
          { $set: set, $unset: unset }
        );
      }
    }
  });
}
print(`\nДокументов с переносом ru->kz: ${moved}`);

// --- 2. Удаление дубликата новости от 2025-11-27 ---
const DUPLICATE_NEWS_ID = UUID('10859f26-c36d-4b95-abd3-d3d10c94487b'); // ru-only копия
const KEPT_NEWS_ID = UUID('2bc6de41-ed26-46f7-8e82-952fd3cf21dc');      // kz+ru версия

const dup = db_.news.findOne({ _id: DUPLICATE_NEWS_ID });
const kept = db_.news.findOne({ _id: KEPT_NEWS_ID });
if (dup && kept) {
  print(`\n[dup] Удаляем новость ${DUPLICATE_NEWS_ID} ("${(dup.title || {}).ru || ''}".slice(0,50))`);
  print(`[dup] Остаётся ${KEPT_NEWS_ID} (языки: ${Object.keys(kept.title || {}).join(',')})`);
  if (apply) {
    db_.news.deleteOne({ _id: DUPLICATE_NEWS_ID });
  }
} else if (!dup) {
  print('\n[dup] Дубликат уже отсутствует — пропускаем.');
} else {
  print('\n[dup] ВНИМАНИЕ: kz+ru версия не найдена — дубликат НЕ удаляем.');
}

print(`\n=== Готово (${apply ? 'изменения применены' : 'dry-run, ничего не изменено'}) ===`);
