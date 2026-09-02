import type { MockStatus, PaymentStep } from './types'

export const paymentCopy = {
  login: '请【登录】',
  loginHint: 'Demo 未接真实登录',
  amountLabel: '付款金额',
  payMethodLabel: '付款方式',
  wechat: '微信',
  alipay: '支付宝',
  payNow: '立即支付',
  waitingPay: '正在等待支付，请稍后',
  waitingPayHint: '若长时间无响应，请更换支付方式',
  allocating: '支付成功，正在分配激活码',
  allocatingHint: '可在我的订单中查看历史订单',
  payFailed: '支付失败',
  payFailedHint: '请更换支付方式或稍后重试',
  back: '返回',
  activationGenerated: '激活码已生成',
  activationCodeLabel: '激活码:',
  copyCode: '复制激活码',
  copyOrder: '复制订单号',
  copySuccess: '复制成功',
  viewActivation: '查看激活方式',
  done: '完成',
  close: '关闭',
  qrHintPrefix: '请使用',
  qrHintOr: '或',
  qrHintSuffix: '扫码支付',
  pageLoading: '订单加载中',
  pageError: '订单接口失败',
  pageErrorHint: '可在 Debug 中切回 Normal 后重试',
  payDisabled: '当前 Mock 状态下无法发起支付',
  debugTitle: '支付流程',
  debugStep: '当前步骤',
  debugWallet: '本机已安装微信/支付宝',
  debugOutcome: '支付结果',
  debugOpen: '打开支付弹窗',
  debugPlacement: '弹窗布局',
  debugPlacementBottom: 'bottom 底部',
  debugPlacementCenter: 'center 居中',
  debugPlacementRule: '形态节点',
  debugWalletOn: '已安装',
  debugWalletOff: '未安装',
  debugFlow: '自动流程',
} as const

export const detailLabels: Record<string, string> = {
  game: '游戏',
  platform: '平台',
  version: '版本',
  language: '语言',
  orderNo: '订单号',
  region: '区服',
  edition: '版本扩展',
  note: '备注',
}

export const paymentStepLabels: Record<PaymentStep, string> = {
  confirm: '确认支付',
  qrcode: '扫码支付',
  loading: '等待支付',
  allocating: '分配激活码',
  success: '支付成功',
  failure: '支付失败',
  activation: '激活方式',
}

export const mockStatusLabels: Record<MockStatus, string> = {
  normal: 'Normal',
  empty: 'Empty',
  loading: 'Loading',
  error: 'Error',
  longText: 'Long Text',
  longList: 'Long List',
  boundary: 'Boundary',
  abnormal: 'Abnormal',
}

export function detailLabel(key: string): string {
  return detailLabels[key] ?? key
}
