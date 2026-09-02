import { activationSteps } from './activation'
import type {
  ActivationStep,
  MockStatus,
  PaymentMockConfig,
  PaymentMockPayload,
  PaymentOrder,
} from './types'

const orderNormal: PaymentOrder = {
  amount: 365,
  currencySymbol: '¥',
  activationCode: '1232-A324-3E1F-1245',
  orderNo: 'ASDFW3IFJ5689856',
  details: [
    { key: 'game', value: '荒野大镖客:救赎2' },
    { key: 'platform', value: 'STEAM', platformIcon: 'steam' },
    { key: 'version', value: '标准版' },
    { key: 'language', value: '简体中文' },
  ],
}

const orderEmpty: PaymentOrder = {
  amount: 0,
  currencySymbol: '¥',
  activationCode: '',
  orderNo: '',
  details: [],
}

const orderLongText: PaymentOrder = {
  amount: 365,
  currencySymbol: '¥',
  activationCode: 'STEAM-VERY-LONG-ACTIVATION-CODE-1232-A324-3E1F-1245-EXTRA',
  orderNo: 'ORDER-LONG-ASDFW3IFJ5689856-BORDER-CHECK',
  details: [
    {
      key: 'game',
      value: '荒野大镖客：救赎2 终极版暨西部传奇收藏合集（含全部剧情DLC与外观包）',
    },
    { key: 'platform', value: 'STEAM', platformIcon: 'steam' },
    { key: 'version', value: '收藏典藏数字豪华终极版（含预购奖励与季票）' },
    { key: 'language', value: '简体中文 / 繁体中文 / English / 日本語' },
  ],
}

const extraDetails: PaymentOrder['details'] = [
  { key: 'region', value: '全球' },
  { key: 'edition', value: '标准版 + 剧情DLC' },
  { key: 'note', value: '本条用于验证超长明细列表折行与滚动' },
]

const extraActivationSteps: ActivationStep[] = [
  {
    heading: '步骤4',
    body: '若激活码无效，请回到订单详情核对后重新复制。本条用于验证超长激活说明列表。',
    image: activationSteps[0].image,
  },
  {
    heading: '步骤5',
    body: '激活完成后可在 Steam 库中搜索该游戏。若未显示，请重启客户端后再试。',
    image: activationSteps[1].image,
  },
  {
    heading: '步骤6',
    body: '仍无法激活时，请保留订单号并联系客服。Demo 不会发起真实工单。',
    image: activationSteps[2].image,
  },
]

const orderLongList: PaymentOrder = {
  ...orderNormal,
  details: [...orderNormal.details, ...extraDetails],
}

const orderBoundary: PaymentOrder = {
  amount: 0.01,
  currencySymbol: '¥',
  activationCode: 'A',
  orderNo: '1',
  details: [{ key: 'game', value: '试玩' }],
}

const orderAbnormal: PaymentOrder = {
  amount: -1,
  currencySymbol: '',
  activationCode: '',
  orderNo: '',
  details: [
    { key: 'game', value: '' },
    { key: 'ghost', value: '???' },
    { key: 'platform', value: 'UNKNOWN' },
  ],
}

export const defaultPaymentConfig: PaymentMockConfig = {
  walletInstalled: true,
  outcome: 'success',
  processingMs: 1800,
  allocatingMs: 1600,
  qrWaitMs: 2200,
}

export const paymentMocks: Record<MockStatus, PaymentMockPayload> = {
  normal: {
    status: 'normal',
    pageState: 'ready',
    errorMessage: '',
    order: orderNormal,
    activationSteps,
  },
  empty: {
    status: 'empty',
    pageState: 'ready',
    errorMessage: '',
    order: orderEmpty,
    activationSteps: [],
  },
  loading: {
    status: 'loading',
    pageState: 'loading',
    errorMessage: '',
    order: orderNormal,
    activationSteps,
  },
  error: {
    status: 'error',
    pageState: 'error',
    errorMessage: '订单接口超时，请稍后重试',
    order: orderEmpty,
    activationSteps: [],
  },
  longText: {
    status: 'longText',
    pageState: 'ready',
    errorMessage: '',
    order: orderLongText,
    activationSteps: [
      {
        heading: '步骤1',
        body:
          '这是一段用于验证超长激活说明折行的文案。请先确认设备已安装 Steam，并从联想 PC 软件商店下载正版客户端后再继续。',
        image: activationSteps[0].image,
      },
      ...activationSteps.slice(1),
    ],
  },
  longList: {
    status: 'longList',
    pageState: 'ready',
    errorMessage: '',
    order: orderLongList,
    activationSteps: [...activationSteps, ...extraActivationSteps],
  },
  boundary: {
    status: 'boundary',
    pageState: 'ready',
    errorMessage: '',
    order: orderBoundary,
    activationSteps: [activationSteps[0]],
  },
  abnormal: {
    status: 'abnormal',
    pageState: 'ready',
    errorMessage: '',
    order: orderAbnormal,
    activationSteps,
  },
}

export function getPaymentMock(status: MockStatus): PaymentMockPayload {
  return paymentMocks[status]
}

export const defaultPaymentOrder = orderNormal
