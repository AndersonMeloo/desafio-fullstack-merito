export type Fund = {
  id: string
  name: string
  ticker: string
  type: string
  pricePerShare: number
}

export type TransactionType = 'APORTE' | 'RESGATE'

export type Transaction = {
  id: string
  fundId: string
  type: TransactionType
  amount: number
  shares: number
  date: string
  fund: Fund
}

export type WalletPosition = {
  fundId: string
  fundName: string
  ticker: string
  shares: number
  balance: number
}

export type WalletSummary = {
  totalBalance: number
  positions: WalletPosition[]
}

export type ApiResponse<T> = {
  message: string
  data: T
}

export type FundFormState = {
  name: string
  ticker: string
  type: string
  pricePerShare: string
}

export type TransactionFormState = {
  fundId: string
  type: TransactionType
  amount: string
  date: string
}

export const initialFundForm: FundFormState = {
  name: '',
  ticker: '',
  type: '',
  pricePerShare: '',
}

export const initialTransactionForm: TransactionFormState = {
  fundId: '',
  type: 'APORTE',
  amount: '',
  date: '',
}
