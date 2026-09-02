import type { ActivationStep } from './types'
import { paymentCopy } from './copy'
import activationStep1 from '../assets/activation-step1.png'
import activationStep2 from '../assets/activation-step2.png'
import activationStep3 from '../assets/activation-step3.png'

export const activationSteps: ActivationStep[] = [
  {
    heading: paymentCopy.activationStep1Heading,
    body: paymentCopy.activationStep1Body,
    linkText: paymentCopy.activationSteamUrl,
    linkHref: paymentCopy.activationSteamUrl,
    hint: paymentCopy.activationStep1Hint,
    image: activationStep1,
  },
  {
    heading: paymentCopy.activationStep2Heading,
    body: paymentCopy.activationStep2Body,
    image: activationStep2,
  },
  {
    heading: paymentCopy.activationStep3Heading,
    body: paymentCopy.activationStep3Body,
    image: activationStep3,
  },
]
