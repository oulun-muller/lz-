import { computed, ref, watch } from 'vue'
import type {
  PaymentDebugState,
  PaymentMethod,
  PaymentOrder,
  PaymentOutcome,
  PaymentStep,
} from '../data/types'
import { defaultPaymentConfig } from '../data/mock'

export function usePayment(options: {
  order: () => PaymentOrder
  debug: () => PaymentDebugState
}) {
  const visible = ref(false)
  const step = ref<PaymentStep>('confirm')
  const method = ref<PaymentMethod>('wechat')
  let timer: ReturnType<typeof setTimeout> | null = null

  const effectiveStep = computed(() => options.debug().forceStep ?? step.value)

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function resetFlow() {
    clearTimer()
    step.value = 'confirm'
    method.value = 'wechat'
  }

  function open() {
    resetFlow()
    visible.value = true
  }

  function close() {
    clearTimer()
    visible.value = false
    step.value = 'confirm'
  }

  function selectMethod(next: PaymentMethod) {
    method.value = next
  }

  function startProcessing() {
    step.value = 'loading'
    clearTimer()
    timer = setTimeout(() => {
      const outcome = options.debug().outcome ?? defaultPaymentConfig.outcome
      step.value = outcome === 'success' ? 'success' : 'failure'
    }, defaultPaymentConfig.processingMs)
  }

  function submitPay() {
    const installed = options.debug().walletInstalled ?? defaultPaymentConfig.walletInstalled
    if (installed) {
      startProcessing()
      return
    }
    step.value = 'qrcode'
    clearTimer()
    timer = setTimeout(() => {
      startProcessing()
    }, 2200)
  }

  function retryPay() {
    startProcessing()
  }

  function openActivation() {
    step.value = 'activation'
  }

  function backFromActivation() {
    step.value = 'success'
  }

  watch(
    () => options.debug().forceStep,
    (forced) => {
      if (forced) {
        clearTimer()
      }
    },
  )

  return {
    visible,
    step,
    effectiveStep,
    method,
    open,
    close,
    selectMethod,
    submitPay,
    retryPay,
    openActivation,
    backFromActivation,
  }
}

export type UsePaymentReturn = ReturnType<typeof usePayment>
