import express from 'express'
import { getUserConverts } from './utils/get-user-converts.js'
import { getConvertTypes } from './utils/get-convert-types.js'
import { requireAuth } from '../../utils/auth.js'
import { getTypeLimitsMap } from './utils/type-limits.js'

const router = express.Router()

const sumNumber = (value) => (Number.isFinite(value) ? value : 0)

router.get('/converts-overview', requireAuth, async (req, res) => {
  try {
    const userId = req.userId
    const [convertTypes, converts, typeLimits] = await Promise.all([
      getConvertTypes(),
      getUserConverts(userId),
      getTypeLimitsMap({ userId, user: req.user }),
    ])

    if (!converts || converts.length === 0) {
      return res.json([]) // <-- возвращаем пустой массив вместо null
    }

    const typeByCode = new Map(convertTypes.map((t) => [t.code, t]))
    const overviewMap = new Map()

    for (const convert of converts) {
      const code = convert.typeCode
      const metaType = typeByCode.get(code)
      if (!code || !metaType) continue

      if (!overviewMap.has(code)) {
        const limit = typeLimits[code] ?? null
        overviewMap.set(code, {
          code,
          currentSum: 0,
          current_convert_limit: convert.targetAmount != null ? Number(convert.targetAmount) : null,
          info: {
            code: metaType.code,
            title: metaType.title,
            type_id: metaType.id ?? metaType.sortOrder ?? null,
            is_reset: Boolean(metaType.isReset),
            has_limit: Boolean(metaType.hasLimit),
            can_spend: Boolean(metaType.canSpend),
            convert_type_limit: limit != null ? Number(limit) : null,
            used_limit: 0,
            avaliable_limit: null,
          },
        })
      }

      const entry = overviewMap.get(code)

      // корректный расчёт текущего баланса
      const initialAmount = Number(convert.initialAmount ?? 0)
      const transactionsSum = Number(convert.transactionsSum ?? 0)
      const currentBalance = initialAmount - transactionsSum

      entry.currentSum += currentBalance

      const targetAmount = Number(convert.targetAmount ?? 0)
      const usedIncrement = targetAmount || initialAmount

      entry.info.used_limit += sumNumber(usedIncrement)

      if (entry.info.convert_type_limit != null) {
        entry.info.avaliable_limit = Number(
          (entry.info.convert_type_limit - entry.info.used_limit).toFixed(2),
        )
      }
    }

    const overviewArray = Array.from(overviewMap.values())

    return res.json(overviewArray)
  } catch (error) {
    console.error('Failed to fetch converts overview', error)
    res
      .status(500)
      .json({ message: 'Ошибка сервера при получении сводки конвертов' })
  }
})

export default router
