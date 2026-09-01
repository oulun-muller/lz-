export type DeviceType = 'phone' | 'pad' | 'desktop'

export const PHONE_MAX_WIDTH = 767
export const PAD_MAX_WIDTH = 1023
export const CONTENT_MAX_WIDTH = 412
export const ELEVATOR_PANEL_WIDTH = 136
export const ELEVATOR_TRIGGER_SIZE = 40
export const ELEVATOR_BOTTOM_OFFSET = 16

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

/**
 * 设计稿规则：侧边页边距不足以放下 136px 电梯面板时走收起态，
 * 否则电梯常显并垂直居中。内容栏按 Phone 设计基准 412px 计算。
 */
export function hasEnoughElevatorMargin(
  viewportWidth: number,
  contentMaxWidth = CONTENT_MAX_WIDTH,
  elevatorWidth = ELEVATOR_PANEL_WIDTH,
): boolean {
  const pageWidth = Math.min(viewportWidth, contentMaxWidth)
  const sideMargin = (viewportWidth - pageWidth) / 2
  return sideMargin >= elevatorWidth
}
