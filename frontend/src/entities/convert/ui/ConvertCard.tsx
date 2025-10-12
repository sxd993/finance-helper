import type { Convert } from '../model/types'
import { computeConvertMetrics, type ConvertMetrics } from '@/shared/utils/convertMetrics'
import { ConvertCardWrapper } from './ConvertCardWrapper'
import { LimitedConvertCard } from './LimitedConvertCard'
import { SavingConvertCard } from './SavingConvertCard'
import { InvestmentConvertCard } from './InvestmentConvertCard'

export const ConvertCard = ({ convert }: { convert: Convert }) => {
  const metrics = computeConvertMetrics(convert)
  const convertType = convert?.type_id?.code as string
  const map: Record<string, React.FC<{ convert: Convert; metrics: ConvertMetrics }>> = {
    important: LimitedConvertCard,
    wishes: LimitedConvertCard,
    saving: SavingConvertCard,
    investment: InvestmentConvertCard,
  }
  const Component = map[convertType]
  if (!Component) {
    console.error(`Unknown convert type: ${convertType}`)
    return (
      <ConvertCardWrapper>
        <div className='text-slate-500 text-sm'>Неизвестный тип конверта: {convertType}</div>
      </ConvertCardWrapper>
    )
  }
  return <Component convert={convert} metrics={metrics} />
}
