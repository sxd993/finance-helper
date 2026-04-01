# Remainders API

## `GET /api/remainders/get-user-remainders`
Назначение: вернуть сохранённые остатки пользователя и агрегат общего доступного баланса.

Ответ:
```json
{
  "summary": {
    "total_amount": 12500,
    "items_count": 3
  },
  "items": [
    {
      "id": 1,
      "amount": 5000,
      "start_date": "01.03.2026",
      "end_date": "31.03.2026"
    }
  ]
}
```

## `POST /api/remainders/redistribute`
Назначение: перераспределить сумму из общего пула остатков в целевой конверт типов `saving` или `investment`.

Запрос:
```json
{
  "convert_id": 12,
  "amount": 3000
}
```

Ответ:
```json
{
  "summary": {
    "total_amount": 9500
  },
  "redistribution": {
    "id": 7,
    "amount": 3000,
    "created_at": "2026-04-01T12:00:00.000Z",
    "target_convert": {
      "id": 12,
      "name": "Подушка безопасности",
      "type_code": "saving"
    }
  }
}
```

## `GET /api/remainders/history`
Назначение: вернуть историю перераспределений остатков с источниками списания.

Ответ:
```json
[
  {
    "id": 7,
    "amount": 3000,
    "created_at": "2026-04-01T12:00:00.000Z",
    "target_convert": {
      "id": 12,
      "name": "Подушка безопасности",
      "type_code": "saving"
    },
    "sources": [
      {
        "id": 10,
        "amount": 3000,
        "start_date": "01.03.2026",
        "end_date": "31.03.2026"
      }
    ]
  }
]
```
