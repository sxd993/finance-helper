# База данных (актуальная версия)

## 1. Общая схема
Бэкенд использует `MySQL + Sequelize`.
Точка инициализации моделей: `backend/src/db/index.js`.
SQL-схема: `backend/db/schema_v2.sql`.

Актуальная модель конвертов: `base + subtype`.

## 2. Таблицы

### `users`
Профиль пользователя и финансовые настройки:
- `monthly_income`
- `percent_important`, `percent_wishes`, `percent_saving`, `percent_investment`
- `cycle_type`

Связи:
- 1:N `cycles`
- 1:N `converts`
- 1:N `expenses`
- 1:N `convert_type_limits`
- 1:N `remainders`

### `convert_types`
Справочник типов:
- `important`, `wishes`, `saving`, `investment`
- флаги: `is_reset`, `has_limit`, `can_spend`

Связи:
- 1:N `converts`
- 1:N `convert_type_limits`
- 1:N `expenses`
- 1:N `remainders`

### `cycles`
Циклы пользователя:
- `start_date`, `end_date`
- `is_closed`, `closed_at`

### `converts` (базовая таблица)
Общие поля конверта:
- `id`, `user_id`, `type_code`, `name`, `is_active`

Связи:
- N:1 к `users`
- N:1 к `convert_types`
- 1:1 к subtype-таблицам:
  - `convert_spend`
  - `convert_saving`
  - `convert_investment`
- 1:N к `expenses` через `expenses.convert_id`

### `convert_spend`
Данные spendable-конвертов (`important`, `wishes`):
- `convert_id` (PK/FK)
- `monthly_limit`
- `funded_amount`

### `convert_saving`
Данные накоплений:
- `convert_id` (PK/FK)
- `goal_amount`
- `saved_amount`

### `convert_investment`
Данные инвестиций (без позиций активов):
- `convert_id` (PK/FK)
- `invested_amount`
- `current_value`

### `expenses`
Расходы пользователя:
- `convert_id` — основной FK на `converts.id`
- `convert_name`, `convert_type` — snapshot-поля для истории/отчётов
- `sum`, `date`, `icon_name`

### `convert_type_limits`
Лимиты по типам:
- PK: `(user_id, type_code)`
- хранится только `limit_amount`
- распределение считается динамически из subtype-таблиц

### `remainders`
Остатки после закрытия цикла:
- `user_id`, `cycle_id`, `type_code`, `amount`
- `UNIQUE (cycle_id, type_code)`

## 3. Ключевые бизнес-правила по данным

### Spend (`important`/`wishes`)
- Баланс конверта: `funded_amount - SUM(expenses)` за активный цикл.
- Проверка траты выполняется по этому балансу.

### Saving
- `goal_amount` — цель.
- `saved_amount` — текущий накопленный объём.

### Investment
- `invested_amount` — вложенная база.
- `current_value` — текущая оценка.
- PnL считается на уровне API.

### Лимиты типов
- `limit_amount` задаёт верхнюю границу по типу.
- `allocated/used` в ответах вычисляется динамически, не хранится отдельно.

## 4. Как данные проходят через систему

### Регистрация (`POST /api/auth/register`)
В транзакции:
1. Создаётся `users`.
2. Создаётся первый открытый `cycles`.
3. Создаются строки `convert_type_limits` для всех типов (по доходу/процентам).

### Конверты (`/api/converts/*`)
- `add-convert`: создаёт запись в `converts` и в нужной subtype-таблице.
- `edit-convert`: обновляет базу + subtype по `type_code`.
- `get-converts`: отдаёт унифицированный DTO с тип-специфичными полями.
- `replenish-convert`: пополняет `saved_amount` (saving) или `invested_amount` (investment).
- `delete-convert`: удаляет конверт; при наличии расходов сначала удаляются связанные `expenses` (текущая реализация под FK `RESTRICT`).

### Расходы (`/api/expenses/*`)
- Привязка по `convert_id`.
- При создании/редактировании проверяется:
  - валидность payload,
  - принадлежность конверта пользователю,
  - `can_spend` типа,
  - доступный баланс spend-конверта.

### Циклы (`backend/src/features/cycles/cycle.js`)
Планировщик (cron):
1. Закрывает цикл при достижении порога.
2. Открывает новый цикл.
3. Сохраняет остатки в `remainders`.
4. Сбрасывает/пересчитывает лимиты типов.

## 5. Технические примечания
- Денежные значения: `DECIMAL(12,2)`.
- Дата расхода: `BIGINT` (unix ms).
- Дата цикла: `DATE`.
- Критичные операции обёрнуты в `sequelize.transaction`.
- Авторизация и доступ к данным завязаны на `req.userId` из `requireAuth`.
