export interface UserConvertLimit {
  userId: number
  typeCode: string
  limitAmount: number
  distributedAmount: number
  remainderAmount: number
  updatedAt: string
}

export interface UseUserConvertsLimitsResult {
  userConvertsLimits: UserConvertLimit[] | null
  isLoading: boolean
  error: unknown
}