export interface UserConvertLimit {
  userId: number
  typeCode: string
  limitAmount: number
  allocatedAmount: number
  spentAmount: number
  availableToAllocate: number
  availableToSpend: number
  updatedAt: string
}

export interface UseUserConvertsLimitsResult {
  userConvertsLimits: UserConvertLimit[] | null
  isLoading: boolean
  error: unknown
}
