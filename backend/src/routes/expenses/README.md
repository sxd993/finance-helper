# Expenses routes

> Все роуты защищены мидлварой `requireAuth` и доступны только после успешной аутентификации.

## GET `/expenses/get-expenses`
Возвращает список трат пользователя, отсортированный по дате (по убыванию). Принимает необязательный query-параметр `convert_type`.

**Response 200**
```json
[
  {
    "name": "Coffee",
    "convert_name": "Повседневные расходы",
    "convert_type": "basic",
    "convert_title": "Базовые",
    "sum": 180,
    "date": 1700000000000,
    "icon_name": "coffee",
    "icon_color": "#A76D22"
  }
]
```

## POST `/expenses/add-expense`
Создаёт новую трату для конверта пользователя.

**Request body**
```json
{
  "expense": {
    "name": "Coffee",
    "convert_name": "Повседневные расходы",
    "convert_type": "basic",
    "sum": 180,
    "date": 1700000000000,
    "icon_name": "coffee",
    "icon_color": "#A76D22"
  }
}
```

- `convert_name` — обязательное поле. Конверт должен существовать и принадлежать текущему пользователю.
- `convert_type` — опционально, но если указано, то должно совпадать с типом найденного конверта. Сам тип берётся из справочника `convert_types`.
- `sum` — положительное число.
- `date` — unix timestamp в миллисекундах.

**Response 201**
```json
{
  "id": 12,
  "name": "Coffee",
  "convert_name": "Повседневные расходы",
  "convert_type": "basic",
  "convert_title": "Базовые",
  "sum": 180,
  "date": 1700000000000,
  "icon_name": "coffee",
  "icon_color": "#A76D22"
}
```

## PUT `/expenses/edit-expense/:id`
Редактирует существующую трату. Все поля передаются в том же формате, что и при создании.

**Response 200**
```json
{
  "id": 12,
  "name": "Groceries",
  "convert_name": "Повседневные расходы",
  "convert_type": "basic",
  "convert_title": "Базовые",
  "sum": 950,
  "date": 1701000000000,
  "icon_name": "groceries",
  "icon_color": "#228B22"
}
```

## DELETE `/expenses/delete-expense/:id`
Удаляет трату по её идентификатору.

**Response 200**
```json
{
  "message": "Трата удалена",
  "id": 12
}
```

## Возможные ошибки
- `400` — ошибка валидации входных данных, несоответствие типа конверта или некорректный идентификатор.
- `404` — не найден конверт пользователя или сама трата.
- `500` — непредвиденная серверная ошибка.
