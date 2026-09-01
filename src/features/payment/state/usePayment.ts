import { computed, ref, watch } from 'vue'
import type {
  PaymentDebugState,
  PaymentMethod,
  PaymentOrder,
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

  function finishOutcome() {
    const outcome = options.debug().outcome ?? defaultPaymentConfig.outcome
    if (outcome === 'success') {
      step.value = 'allocating'
      timer = setTimeout(() => {
        step.value = 'success'
      }, defaultPaymentConfig.allocatingMs)
      return
    }
    step.value = 'failure'
  }

  function startProcessing() {
    step.value = 'loading'
    clearTimer()
    timer = setTimeout(finishOutcome, defaultPaymentConfig.processingMs)
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

  function goBack() {
    clearTimer()
    if (step.value === 'activation') {
      step.value = 'success'
      return
    }
    step.value = 'confirm'
  }

  function openActivation() {
    step.value = 'activation'
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
    goBack,
    openActivation,
  }
}

export type UsePaymentReturn = ReturnType<typeof usePayment>
