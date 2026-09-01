import type { PaymentPlacement } from '@/features/payment/data/types'

export type DeviceType = 'phone' | 'pad' | 'desktop'

export const PHONE_MAX_WIDTH = 767
export const PAD_MAX_WIDTH = 1023

/** 预览画幅宽度 < 该值：Phone 底部弹窗；>= 该值：Pad 居中弹窗 */
export const PAYMENT_CENTER_MIN_WIDTH = 768

export const PREVIEW_WIDTHS = [375, 390, 412, 414, 430, 768, 800, 834, 1024] as const

export function getDeviceType(width: number): DeviceType {
  if (width <= PHONE_MAX_WIDTH) return 'phone'
  if (width <= PAD_MAX_WIDTH) return 'pad'
  return 'desktop'
}

export function getPaymentPlacement(width: number): PaymentPlacement {
  return width < PAYMENT_CENTER_MIN_WIDTH ? 'bottom' : 'center'
}

export function getBreakpointLabel(width: number): string {
  const device = getDeviceType(width)
  if (device === 'phone') return `Phone · ${width}px`
  if (device === 'pad') return `Pad · ${width}px`
  return `Desktop · ${width}px`
}
