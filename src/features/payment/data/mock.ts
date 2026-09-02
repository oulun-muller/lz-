import type { PaymentMockConfig, PaymentOrder } from './types'

export const defaultPaymentOrder: PaymentOrder = {
  amount: 365,
  currencySymbol: '¥',
  activationCode: '1232-A324-3E1F-1245',
  orderNo: 'ASDFW3IFJ5689856',
  details: [
    { key: 'game', label: '游戏', value: '荒野大镖客:救赎2' },
    { key: 'platform', label: '平台', value: 'STEAM', platformIcon: 'steam' },
    { key: 'version', label: '版本', value: '标准版' },
    { key: 'language', label: '语言', value: '简体中文' },
  ],
}

export const defaultPaymentConfig: PaymentMockConfig = {
  walletInstalled: true,
  outcome: 'success',
  processingMs: 1800,
  allocatingMs: 1600,
}
