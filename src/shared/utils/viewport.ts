export type DeviceType = 'phone' | 'pad' | 'desktop'

export const PHONE_MAX_WIDTH = 767
export const PAD_MAX_WIDTH = 1023

export const PREVIEW_WIDTHS = [375, 390, 412, 414, 430, 768, 800, 834, 1024] as const

export function getDeviceType(width: number): DeviceType {
  if (width <= PHONE_MAX_WIDTH) return 'phone'
  if (width <= PAD_MAX_WIDTH) return 'pad'
  return 'desktop'
}

export function getBreakpointLabel(width: number): string {
  const device = getDeviceType(width)
  if (device === 'phone') return `Phone · ${width}px`
  if (device === 'pad') return `Pad · ${width}px`
  return `Desktop · ${width}px`
}
