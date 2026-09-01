<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import DebugPanel from '@/shared/ui/DebugPanel.vue'
import PaymentDemo from '@/features/payment/PaymentDemo.vue'
import type {
  PaymentDebugState,
  PaymentOutcome,
  PaymentStep,
} from '@/features/payment/data/types'
import { PREVIEW_WIDTHS } from '@/shared/utils/viewport'

const stageRef = ref<HTMLElement | null>(null)
const previewWidth = ref(typeof window !== 'undefined' && window.innerWidth <= 430 ? 0 : 412)
const viewportWidth = ref(412)
const viewportHeight = ref(720)
const paymentStep = ref<PaymentStep | null>('confirm')
const openPaymentSignal = ref(0)

const paymentDebug = ref<PaymentDebugState>({
  forceStep: null,
  walletInstalled: true,
  outcome: 'success',
})

const paymentSteps: Array<PaymentStep | null> = [
  null,
  'confirm',
  'qrcode',
  'loading',
  'success',
  'failure',
  'activation',
]

function measure() {
  const stage = stageRef.value
  if (!stage) return
  viewportWidth.value = Math.round(stage.clientWidth)
  viewportHeight.value = Math.round(stage.clientHeight)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(() => measure())
  if (stageRef.value) {
    resizeObserver.observe(stageRef.value)
  }
  window.addEventListener('resize', measure)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measure)
})

const stageStyle = computed(() => {
  if (previewWidth.value === 0) {
    return { width: '100%', maxWidth: '100%' }
  }
  return {
    width: `${previewWidth.value}px`,
    maxWidth: '100%',
  }
})

function triggerOpenPayment() {
  openPaymentSignal.value += 1
}

function setPaymentForceStep(step: PaymentStep | null) {
  paymentDebug.value = { ...paymentDebug.value, forceStep: step }
}

function setWalletInstalled(value: boolean) {
  paymentDebug.value = { ...paymentDebug.value, walletInstalled: value }
}

function setPaymentOutcome(value: PaymentOutcome) {
  paymentDebug.value = { ...paymentDebug.value, outcome: value }
}
</script>

<template>
  <div class="app-shell">
    <div class="app-shell__stage" :style="stageStyle">
      <div ref="stageRef" class="app-shell__viewport">
        <PaymentDemo
          :viewport-width="viewportWidth"
          :payment-debug="paymentDebug"
          :open-payment-signal="openPaymentSignal"
          @change-payment-step="paymentStep = $event"
        />
      </div>
    </div>
    <DebugPanel
      :viewport-width="viewportWidth"
      :viewport-height="viewportHeight"
      :preview-width="previewWidth"
      :payment-step="paymentStep"
      :payment-debug="paymentDebug"
      :payment-steps="paymentSteps"
      :preview-widths="PREVIEW_WIDTHS"
      @update:preview-width="previewWidth = $event"
      @open-payment="triggerOpenPayment"
      @update:payment-force-step="setPaymentForceStep"
      @update:wallet-installed="setWalletInstalled"
      @update:payment-outcome="setPaymentOutcome"
    />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-12);
  background:
    radial-gradient(circle at top, #2a2a30 0%, transparent 42%),
    #111113;
}

.app-shell__stage {
  height: 100%;
  min-width: 320px;
  overflow: hidden;
  border: var(--border-width-1) solid var(--color-border-subtle);
  border-radius: var(--radius-16);
  box-shadow: var(--shadow-card);
}

.app-shell__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-page);
}

@media (max-width: 430px) {
  .app-shell {
    padding: 0;
  }

  .app-shell__stage {
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
