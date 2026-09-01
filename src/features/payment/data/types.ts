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

export interface PaymentOrderDetail {
  key: string
  label: string
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
}

export interface PaymentMockConfig {
  walletInstalled: boolean
  outcome: PaymentOutcome
  processingMs: number
  allocatingMs: number
}

export interface PaymentDebugState {
  forceStep: PaymentStep | null
  walletInstalled: boolean
  outcome: PaymentOutcome
}
