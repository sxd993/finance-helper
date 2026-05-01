# База данных (актуальная версия)

## 1. Общая схема
- Бэкенд использует `MySQL + Sequelize`.
- Точка инициализации моделей: `backend/src/db/index.js`.
- SQL-схема: `backend/db/schema_v2.sql`.
- Модель конвертов: `base + subtype`.

## 2. Таблицы

### `users`
Профиль пользователя и финансовые настройки:
- `login`, `name`, `email`, `password_hash`
- `monthly_income`
- `percent_important`, `percent_wishes`, `percent_saving`, `percent_investment`
- `cycle_type`
- `created_at`, `updated_at`

FK-зависимые таблицы:
- `cycles.user_id`
- `converts.user_id`
- `operations.user_id`
- `convert_type_limits.user_id`
- `remainders.user_id`
- `remainder_redistributions.user_id`

Sequelize-ассоциации, описанные в коде:
- 1:N `cycles`
- 1:N `converts`
- 1:N `operations`
- 1:N `remainders`

### `convert_types`
Справочник типов:
- `important`
- `wishes`
- `saving`
- `investment`

Поля:
- `code`, `title`, `description`
- `is_reset`, `has_limit`, `can_spend`
- `sort_order`, `created_at`

FK-зависимые таблицы:
- `converts.type_code`
- `operations.convert_type`
- `convert_type_limits.type_code`
- `remainders.type_code`
- `remainder_redistributions.target_type_code`

Sequelize-ассоциации, описанные в коде:
- 1:N `converts`

### `cycles`
Циклы пользователя:
- `user_id`
- `start_date`, `end_date`
- `is_closed`, `closed_at`
- `created_at`

FK:
- `user_id -> users.id`

Sequelize-ассоциации, описанные в коде:
- N:1 `user`
- 1:N `remainders`

### `converts`
Базовая таблица конвертов:
- `id`, `user_id`, `type_code`, `name`, `is_active`
- `created_at`, `updated_at`

FK:
- `user_id -> users.id`
- `type_code -> convert_types.code`

Sequelize-ассоциации, описанные в коде:
- N:1 `user`
- N:1 `type`
- 1:N `operations`
- 1:1 `spend`
- 1:1 `saving`
- 1:1 `investment`

### `convert_spend`
Данные spendable-конвертов (`important`, `wishes`):
- `convert_id` (PK/FK)
- `monthly_limit`
- `funded_amount`

FK:
- `convert_id -> converts.id`

### `convert_saving`
Данные накоплений:
- `convert_id` (PK/FK)
- `goal_amount`
- `saved_amount`

FK:
- `convert_id -> converts.id`

### `convert_investment`
Данные инвестиций:
- `convert_id` (PK/FK)
- `invested_amount`
- `current_value`

FK:
- `convert_id -> converts.id`

### `operations`
Единый журнал операций:
- `id`, `user_id`
- `type`: `expense` или `replenishment`
- `source`: `spend`, `type_limit` или `remainder`
- `amount`, `occurred_at`
- snapshot конверта: `convert_id`, `convert_name`, `convert_type`
- `title`, `icon_name`
- ссылка на перераспределение остатков: `remainder_redistribution_id`

Примечание:
- расходы хранятся прямо как `operations.type = expense`
- пополнения через лимит типа и распределения остатков создают записи `replenishment`

### `convert_type_limits`
Лимиты по типам:
- PK: `(user_id, type_code)`
- `limit_amount`
- `updated_at`

FK:
- `user_id -> users.id`
- `type_code -> convert_types.code`

Примечание:
- хранится только `limit_amount`
- `used/allocated` считается динамически на уровне API

### `remainders`
Остатки после закрытия цикла:
- `id`, `user_id`, `cycle_id`, `type_code`
- snapshot источника: `source_convert_id`, `source_convert_name`
- `amount`, `created_at`

FK:
- `user_id -> users.id`
- `cycle_id -> cycles.id`
- `type_code -> convert_types.code`

Примечание:
- одна запись хранит агрегированный остаток категории за закрытый цикл

### `remainder_redistributions`
История операций перераспределения остатков:
- `id`, `user_id`
- `target_convert_id`
- `target_type_code`
- `amount`
- `created_at`

FK:
- `user_id -> users.id`
- `target_convert_id -> converts.id`
- `target_type_code -> convert_types.code`

Sequelize-ассоциации, описанные в коде:
- N:1 `user`
- N:1 `targetConvert`
- N:1 `targetType`
- 1:N `items`

### `remainder_redistribution_items`
Детализация списания по конкретным остаткам:
- `id`
- `redistribution_id`
- `remainder_id`
- `amount`

FK:
- `redistribution_id -> remainder_redistributions.id`
- `remainder_id -> remainders.id`

Sequelize-ассоциации, описанные в коде:
- N:1 `redistribution`
- N:1 `remainder`

## 3. Ключевые бизнес-правила по данным

### Spend (`important`/`wishes`)
- Баланс конверта: `funded_amount - SUM(operations.amount WHERE type = 'expense')` за активный цикл.
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

### Остатки циклов
- При закрытии цикла остатки spend-категорий агрегируются по `type_code` и сохраняются в `remainders`.
- История остатков показывает дату цикла, категорию и сумму агрегированного остатка.

### Перераспределение остатков
- Общий доступный баланс считается суммой `remainders.amount` пользователя.
- Перераспределение разрешено только в конверты типов `saving` и `investment`.
- При переводе сумма списывается из нескольких `remainders` по FIFO: сначала более ранние `created_at`, затем меньший `id`.
- Факт операции записывается в `remainder_redistributions`.
- Детализация, из каких остатков была собрана сумма, записывается в `remainder_redistribution_items`.

## 4. Как данные проходят через систему

### Регистрация (`POST /api/auth/register`)
В транзакции:
1. Создаётся `users`.
2. Создаётся первый открытый `cycles`.
3. Создаются строки `convert_type_limits` для всех типов по доходу и процентам.

Payload принимает базовые данные пользователя, `monthly_income` и проценты распределения:
`percentImportant`, `percentWishes`, `percentSaving`, `percentInvestment`.
Сумма процентов должна равняться `100`; если проценты не переданы, используется распределение по умолчанию `50/30/10/10`.

### Конверты (`/api/converts/*`)
- `add-convert`: создаёт запись в `converts` и в нужной subtype-таблице.
- `edit-convert`: обновляет базу и subtype по `type_code`.
- `get-converts`: отдаёт унифицированный DTO с тип-специфичными полями.
- `replenish-convert`: пополняет `saved_amount` или `invested_amount` из лимита типа и пишет операцию в журнал.
- `delete-convert`: удаляет конверт; связанные операции не удаляются, а теряют ссылку через `operations.convert_id -> NULL`.

### Расходы (`/api/expenses/*`)
- Совместимый API для списаний; физически работает с таблицей `operations`.
- Привязка по `convert_id`.
- При создании и редактировании проверяется:
  - валидность payload
  - принадлежность конверта пользователю
  - `can_spend` типа
  - доступный баланс spend-конверта

### Циклы (`backend/src/features/cycles/cycle.js`)
Планировщик:
1. Закрывает активный цикл при достижении порога.
2. Открывает новый цикл.
3. Сохраняет остатки в `remainders`.
4. Пересчитывает лимиты типов и сбрасывает распределённые суммы нового цикла.

### Остатки (`/api/remainders/*`)
- `get-user-remainders`: возвращает `summary` и список остатков по циклам.
- `redistribute`: переводит сумму из общего пула остатков в целевой конверт.
- `history`: возвращает историю формирования остатков по категориям.

### История (`/api/history`)
- `GET /api/history`: возвращает общий журнал операций.
- Query `operation_type`: `all`, `expense`, `replenishment`.

## 5. Технические примечания
- Денежные значения: `DECIMAL(12,2)`.
- Дата операции: `BIGINT UNSIGNED` (unix ms).
- Даты цикла: `DATE`.
- Большинство сущностей используют `snake_case` в БД и camelCase в Sequelize-моделях через `field`.
- Критичные операции выполняются в `sequelize.transaction`.
- Авторизация и доступ к данным завязаны на `req.userId` из `requireAuth`.
