<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PaymentDialog from './components/PaymentDialog.vue'
import { paymentCopy } from './data/copy'
import { defaultPaymentOrder } from './data/mock'
import type {
  PaymentDebugState,
  PaymentPlacement,
  PaymentStep,
} from './data/types'
import { usePayment } from './state/usePayment'
import { getPaymentPlacement } from '@/shared/utils/viewport'
import landingHero from './assets/landing-hero.png'
import qrCodeImage from './assets/mock-qrcode.png'
import iconToastSuccess from './assets/icon-toast-success.svg'

const props = defineProps<{
  viewportWidth: number
  paymentDebug: PaymentDebugState
  openPaymentSignal?: number
}>()

const emit = defineEmits<{
  'change-payment-step': [step: PaymentStep | null]
}>()

const paymentOrder = computed(() => defaultPaymentOrder)
const paymentDebugRef = computed(() => props.paymentDebug)

const {
  visible: paymentVisible,
  effectiveStep: paymentStep,
  method: paymentMethod,
  open: openPayment,
  close: closePayment,
  selectMethod,
  submitPay,
  goBack,
  openActivation,
} = usePayment({
  order: () => paymentOrder.value,
  debug: () => paymentDebugRef.value,
})

const paymentPlacement = computed<PaymentPlacement>(() =>
  getPaymentPlacement(props.viewportWidth),
)

watch(paymentStep, (step) => emit('change-payment-step', step), { immediate: true })

watch(
  () => props.openPaymentSignal,
  (value, oldValue) => {
    if (value !== undefined && value !== oldValue) {
      openPayment()
    }
  },
)

onMounted(() => {
  const img = new Image()
  img.src = qrCodeImage
})

const TOAST_DURATION_MS = 2000
const TOAST_PUSH_MS = 220
const TOAST_STACK_MAX = 2

const toasts = ref<Array<{ id: number }>>([])
let toastSeq = 0
const toastTimers = new Map<number, number>()

function clearToastTimer(id: number) {
  const timer = toastTimers.get(id)
  if (timer) {
    window.clearTimeout(timer)
    toastTimers.delete(id)
  }
}

function removeToast(id: number) {
  clearToastTimer(id)
  toasts.value = toasts.value.filter((item) => item.id !== id)
}

function showCopyToast() {
  const previous = toasts.value[0]
  const id = ++toastSeq
  const next = [{ id }, ...toasts.value]
  const dropped = next.slice(TOAST_STACK_MAX)
  toasts.value = next.slice(0, TOAST_STACK_MAX)
  dropped.forEach((item) => clearToastTimer(item.id))

  if (previous && toasts.value.some((item) => item.id === previous.id)) {
    clearToastTimer(previous.id)
    toastTimers.set(
      previous.id,
      window.setTimeout(() => removeToast(previous.id), TOAST_PUSH_MS + 80),
    )
  }

  toastTimers.set(
    id,
    window.setTimeout(() => removeToast(id), TOAST_DURATION_MS),
  )
}

function onCopyText(text: string) {
  showCopyToast()
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}

onBeforeUnmount(() => {
  toastTimers.forEach((timer) => window.clearTimeout(timer))
  toastTimers.clear()
})
</script>

<template>
  <div class="payment-demo">
    <img class="payment-demo__bg" :src="landingHero" alt="" />
    <header class="payment-demo__top">
      <button type="button" class="payment-demo__login">{{ paymentCopy.login }}</button>
    </header>
    <button type="button" class="payment-demo__buy" @click="openPayment">
      {{ paymentCopy.payNow }}
    </button>

    <PaymentDialog
      :visible="paymentVisible"
      :placement="paymentPlacement"
      :step="paymentStep"
      :method="paymentMethod"
      :order="paymentOrder"
      @close="closePayment"
      @back="goBack"
      @select-method="selectMethod"
      @submit-pay="submitPay"
      @open-activation="openActivation"
      @copy-text="onCopyText"
    />

    <transition-group name="payment-toast" tag="div" class="payment-toast-stack">
      <div v-for="toast in toasts" :key="toast.id" class="payment-toast" role="status">
        <img class="payment-toast__icon" :src="iconToastSuccess" alt="" />
        <span class="payment-toast__text">{{ paymentCopy.copySuccess }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.payment-demo {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.payment-demo__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.payment-demo__top {
  position: absolute;
  top: var(--safe-top);
  right: 0;
  z-index: var(--z-content);
  display: flex;
  justify-content: flex-end;
  padding: var(--space-16);
}

.payment-demo__login {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  cursor: pointer;
}

.payment-demo__buy {
  position: absolute;
  right: var(--space-16);
  bottom: calc(var(--space-32) + var(--safe-bottom));
  z-index: var(--z-content);
  height: 40px;
  padding: 0 var(--space-16);
  border: 0;
  border-radius: var(--radius-4);
  background: var(--color-payment-primary);
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.payment-toast-stack {
  position: absolute;
  top: var(--payment-toast-top);
  left: 50%;
  z-index: calc(var(--z-payment) + 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--payment-toast-stack-gap);
  transform: translateX(-50%);
  pointer-events: none;
}

.payment-toast {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: var(--payment-toast-height);
  padding: var(--payment-toast-pad-y) var(--space-16);
  border: var(--border-width-1) solid var(--color-payment-toast-border);
  background: var(--color-payment-toast);
  box-shadow: var(--payment-toast-shadow);
}

.payment-toast__icon {
  display: block;
  width: 18px;
  height: 18px;
}

.payment-toast__text {
  padding: 0 var(--space-8);
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  line-height: normal;
  white-space: nowrap;
}

.payment-toast-enter-active,
.payment-toast-leave-active {
  transition:
    opacity var(--payment-toast-push) ease,
    transform var(--payment-toast-push) ease;
}

.payment-toast-move {
  transition: transform var(--payment-toast-push) ease;
}

.payment-toast-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.payment-toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
