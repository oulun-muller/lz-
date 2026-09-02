export type PaymentMethod = 'wechat' | 'alipay'

export type PaymentStep =
  | 'confirm'
  | 'qrcode'
  | 'loading'
  | 'allocating'
  | 'success'
  | 'failure'
  | 'activation'

export type PaymentPlacement = 'bottom' | 'center'

export type PaymentOutcome = 'success' | 'failure'

export type MockStatus =
  | 'normal'
  | 'empty'
  | 'loading'
  | 'error'
  | 'longText'
  | 'longList'
  | 'boundary'
  | 'abnormal'

export type PageReadyState = 'ready' | 'loading' | 'empty' | 'error'

export type PaymentPageException = 'loading' | 'empty'

export type DetailKey = 'game' | 'platform' | 'version' | 'language' | 'orderNo' | 'region' | 'edition' | 'note'

export interface PaymentOrderDetail {
  key: DetailKey | string
  value: string
  platformIcon?: 'steam'
  copyable?: boolean
}

export interface PaymentOrder {
  amount: number
  currencySymbol: string
  details: PaymentOrderDetail[]
  activationCode: string
  orderNo: string
}

export interface ActivationStep {
  heading: string
  body: string
  image: string
  linkText?: string
  linkHref?: string
  hint?: string
}

export interface PaymentMockConfig {
  walletInstalled: boolean
  outcome: PaymentOutcome
  processingMs: number
  allocatingMs: number
  qrWaitMs: number
}

export interface PaymentMockPayload {
  status: MockStatus
  pageState: PageReadyState
  errorMessage: string
  order: PaymentOrder
  activationSteps: ActivationStep[]
}

export interface PaymentDebugState {
  forceStep: PaymentStep | null
  walletInstalled: boolean
  outcome: PaymentOutcome
}
