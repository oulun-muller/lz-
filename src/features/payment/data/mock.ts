import type { ActivationStep, PaymentMockConfig, PaymentOrder } from './types'
import activationStep1 from '../assets/activation-step1.png'
import activationStep2 from '../assets/activation-step2.png'
import activationStep3 from '../assets/activation-step3.png'
import mockQrcode from '../assets/mock-qrcode.png'

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

export const activationSteps: ActivationStep[] = [
  {
    heading: '步骤1',
    body: '下载steam（联想PC软件商店可提供正版steam下载）',
    image: activationStep1,
  },
  {
    heading: '步骤2',
    body: '启动steam，点击steam主页左上的游戏模块选择在steam上激活产品',
    image: activationStep2,
  },
  {
    heading: '步骤3',
    body: '将获取的激活码复制到此位置，完成激活（如图）在steam游戏库中可以找到该游戏，并完成下载，畅玩',
    image: activationStep3,
  },
]

export const qrCodeImage = mockQrcode
