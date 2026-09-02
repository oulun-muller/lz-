import type { PaymentPlacement } from '../data/types'

/** 预览画幅宽度 < 该值：Phone 底部弹窗；>= 该值：Pad 居中弹窗 */
export const PAYMENT_CENTER_MIN_WIDTH = 768

export function getPaymentPlacement(width: number): PaymentPlacement {
  return width < PAYMENT_CENTER_MIN_WIDTH ? 'bottom' : 'center'
}
