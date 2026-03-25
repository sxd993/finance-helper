# База данных и взаимодействие с ней

## 1. Общая схема
Бэкенд использует `MySQL + Sequelize`.
Инициализация подключения и моделей: `backend/src/db/index.js`.

Модели:
- `users`
- `convert_types`
- `cycles`
- `converts`
- `expenses`
- `convert_type_limits`
- `remainders`

SQL-структура и сиды: `backend/db/schema_v2.sql`.

## 2. Таблицы и их назначение

### `users`
Хранит аккаунт и финансовые настройки пользователя:
- профиль: `login`, `name`, `email`, `password_hash`
- доход: `monthly_income`
- проценты распределения: `percent_important`, `percent_wishes`, `percent_saving`, `percent_investment`
- тип цикла: `cycle_type` (сейчас только `monthly`)

Связи:
- 1:N с `cycles`
- 1:N с `converts`
- 1:N с `remainders`
- 1:N с `convert_type_limits`
- 1:N с `expenses`

### `convert_types`
Справочник типов конвертов (сидится при старте схемы):
- `important`, `wishes`, `saving`, `investment`
- флаги поведения: `is_reset`, `has_limit`, `can_spend`
- сортировка: `sort_order`

Связи:
- 1:N с `converts`
- 1:N с `convert_type_limits`
- 1:N с `expenses`
- 1:N с `remainders`

### `cycles`
Финансовые циклы пользователя:
- `start_date`, `end_date`
- `is_closed`, `closed_at`

Связи:
- N:1 к `users`
- 1:N к `remainders`

### `converts`
Конверты пользователя (универсальная таблица для всех типов):
- принадлежность: `user_id`, `type_code`
- название: `name`
- лимиты/цели: `target_amount`
- текущая база для расчета баланса: `initial_amount`
- активность: `is_active`

Связи:
- N:1 к `users`
- N:1 к `convert_types`
- логическая связь с `expenses` по паре `(convert_name, convert_type)`

Примечание: для расходов нет FK на `converts.id`, связка идет по `name + type`.

### `expenses`
Операции расходов:
- `name`
- `convert_name`, `convert_type` (к какому конверту/типу относится расход)
- `sum`
- `date` (Unix timestamp в миллисекундах)
- `icon_name`, `icon_color`

Связи:
- N:1 к `users`
- N:1 к `convert_types`

### `convert_type_limits`
Лимиты пользователя на уровне типа конверта:
- PK: `(user_id, type_code)`
- `limit_amount` - общий лимит типа в текущем цикле
- `distributed_amount` - сколько уже распределено по конвертам этого типа

Связи:
- N:1 к `users`
- N:1 к `convert_types`

### `remainders`
Остатки после закрытия цикла:
- `user_id`, `cycle_id`, `type_code`, `amount`
- уникальность: `(cycle_id, type_code)`

Связи:
- N:1 к `users`
- N:1 к `cycles`
- N:1 к `convert_types`

## 3. Ключевые связи и целостность
- Почти все основные FK каскадно удаляются при удалении пользователя (`ON DELETE CASCADE`).
- `convert_types` защищает справочник: для части связей стоит `ON DELETE RESTRICT`.
- Для `expenses.sum` есть проверка `CHECK (sum > 0)` + валидация в модели/роуте.
- По `remainders` действует `UNIQUE (cycle_id, type_code)`, поэтому остатки на цикл агрегируются по типам.

## 4. Как данные проходят через систему

## 4.1 Регистрация пользователя
Роут: `POST /api/auth/register`

Шаги (в транзакции):
1. Создается запись в `users`.
2. Создается первый открытый цикл в `cycles`.
3. Создаются записи `convert_type_limits` для 4 типов на основе дохода и процентов.
4. Транзакция коммитится, пользователю выдается JWT.

## 4.2 Авторизация и доступ к данным
`requireAuth`:
1. Читает JWT из `Authorization` или cookie.
2. Валидирует токен.
3. Загружает пользователя из `users` по `login`.
4. Кладет `req.user` и `req.userId` для всех бизнес-роутов.

## 4.3 Работа с конвертами
Основные роуты: `/api/converts/*`

### Создание конверта (`add-convert`)
В транзакции:
1. Проверка уникальности имени в рамках пользователя (`converts`).
2. Проверка типа через `convert_types`.
3. Проверка лимита типа (`convert_type_limits`) через `ensureWithinTypeLimit`.
4. Вставка в `converts`.
5. Пересчет `distributed_amount` в `convert_type_limits`.

### Изменение конверта (`edit-convert`)
В транзакции:
1. Поиск конверта пользователя.
2. Проверка типа и дубликатов имени.
3. Проверка лимита с учетом редактируемой записи (`excludeConvertId`).
4. Обновление `converts`.
5. Синхронизация `distributed_amount`.

### Удаление конверта (`delete-convert`)
В транзакции:
1. Проверка, что конверт существует.
2. Проверка суммы расходов по нему в `expenses`.
3. Если траты были, удаление запрещается.
4. Иначе удаляется конверт, потом обновляется `distributed_amount` по типу.

## 4.4 Работа с расходами
Основные роуты: `/api/expenses/*`

### Добавление расхода (`add-expense`)
В транзакции:
1. Валидация payload.
2. Резолв конверта и типа (`converts` + `convert_types`).
3. Проверка `can_spend`.
4. Для лимитных типов проверяется доступный баланс конверта за текущий цикл.
5. Вставка в `expenses`.

### Редактирование/удаление расхода
Оба действия идут в транзакции с блокировкой записи расхода (`LOCK UPDATE`).

## 4.5 Лимиты типов (`convert_type_limits`)
Используются как кэш и контроль распределения:
- `limit_amount` пересчитывается от `monthly_income` и процентов пользователя.
- `distributed_amount` синхронизируется от фактических данных `converts`.
- При старте нового цикла `distributed_amount` сбрасывается в `0`.

## 4.6 Циклы и планировщик
Файл: `backend/src/features/cycles/cycle.js`.

Каждый час cron-задача:
1. Проверяет всех пользователей.
2. Если с `start_date` прошло 30 дней, закрывает текущий цикл (`cycles`).
3. Создает новый цикл.
4. Делает reset конвертов resettable-типов:
   - `important/wishes` удаляются
   - `saving/investment` остаются
5. Сохраняет остатки в `remainders` (агрегировано по типу).
6. Пересчитывает лимиты типов и сбрасывает `distributed_amount`.

## 4.7 Остатки пользователя
Роут: `GET /api/remainders/get-user-remainders`
- Читает `remainders` + связанные `cycles`.
- Возвращает сумму остатка с датами цикла, в котором остаток зафиксирован.

## 5. Где точка входа к БД
- Подключение: `backend/src/db/index.js`
- Регистрация роутов: `backend/src/app.js`
- Запуск сервера и планировщика: `backend/src/server.js`

## 6. Важные технические особенности
- В проекте активно используются транзакции Sequelize для операций, где изменяется несколько таблиц.
- Деньги хранятся в `DECIMAL(12,2)`.
- Даты расходов хранятся в миллисекундах (`BIGINT`), а даты циклов - `DATE`.
- Основной источник прав доступа к данным - `req.userId` после `requireAuth`.
