import type { ActivationStep } from './types'
import activationStep1 from '../assets/activation-step1.png'
import activationStep2 from '../assets/activation-step2.png'
import activationStep3 from '../assets/activation-step3.png'

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
