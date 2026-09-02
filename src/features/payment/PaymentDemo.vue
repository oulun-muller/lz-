<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Message } from 'element-ui'
import PaymentDialog from './components/PaymentDialog.vue'
import { paymentCopy } from './data/copy'
import { getPaymentMock } from './data/mock'
import type {
  MockStatus,
  PaymentDebugState,
  PaymentPlacement,
  PaymentStep,
} from './data/types'
import { getPaymentPlacement } from './state/placement'
import { usePayment } from './state/usePayment'
import landingHero from './assets/landing-hero.jpg'
import qrCodeImage from './assets/mock-qrcode.png'
import iconToastSuccess from './assets/icon-toast-success.svg'

const props = defineProps<{
  viewportWidth: number
  mockStatus: MockStatus
  paymentDebug: PaymentDebugState
  openPaymentSignal?: number
}>()

const emit = defineEmits<{
  'change-payment-step': [step: PaymentStep | null]
  'change-resources-ready': [ready: boolean]
}>()

const payload = computed(() => getPaymentMock(props.mockStatus))
const paymentOrder = computed(() => payload.value.order)
const paymentDebugRef = computed(() => props.paymentDebug)
const pageBlocked = computed(
  () => payload.value.pageState === 'loading' || payload.value.pageState === 'error',
)

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

const heroReady = ref(false)
const qrReady = ref(false)
const resourcesReady = computed(() => heroReady.value && qrReady.value)

watch(resourcesReady, (ready) => emit('change-resources-ready', ready), { immediate: true })

function preload(src: string, flag: { value: boolean }) {
  const img = new Image()
  img.onload = () => {
    flag.value = true
  }
  img.onerror = () => {
    flag.value = true
  }
  img.src = src
}

onMounted(() => {
  preload(landingHero, heroReady)
  preload(qrCodeImage, qrReady)
})

const TOAST_DURATION_MS = 2000
const TOAST_DISPLACE_MS = 600
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
      window.setTimeout(() => removeToast(previous.id), TOAST_DISPLACE_MS),
    )
  }

  toastTimers.set(
    id,
    window.setTimeout(() => removeToast(id), TOAST_DURATION_MS),
  )
}

function onCopyText(text: string) {
  showCopyToast()
  if (text && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {})
  }
}

function onLogin() {
  Message.info(paymentCopy.loginHint)
}

function onBuy() {
  if (pageBlocked.value) {
    Message.error(payload.value.errorMessage || paymentCopy.payDisabled)
    return
  }
  openPayment()
}

onBeforeUnmount(() => {
  toastTimers.forEach((timer) => window.clearTimeout(timer))
  toastTimers.clear()
})
</script>

<template>
  <div class="payment-demo">
    <img class="payment-demo__bg" :src="landingHero" alt="" />

    <el-empty
      v-if="payload.pageState === 'loading'"
      class="payment-demo__empty"
      :description="paymentCopy.pageLoading"
    />
    <el-empty
      v-else-if="payload.pageState === 'error'"
      class="payment-demo__empty"
      :description="payload.errorMessage || `${paymentCopy.pageError}，${paymentCopy.pageErrorHint}`"
    />

    <header v-else class="payment-demo__top">
      <el-button type="text" class="payment-demo__login" @click="onLogin">
        {{ paymentCopy.login }}
      </el-button>
    </header>
    <el-button
      v-if="payload.pageState === 'ready'"
      type="primary"
      class="payment-demo__buy"
      @click="onBuy"
    >
      {{ paymentCopy.payNow }}
    </el-button>

    <PaymentDialog
      :visible="paymentVisible"
      :placement="paymentPlacement"
      :step="paymentStep"
      :method="paymentMethod"
      :order="paymentOrder"
      :activation-steps="payload.activationSteps"
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
  background: var(--color-bg-page);
}

.payment-demo__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.payment-demo__empty {
  position: absolute;
  inset: 0;
  z-index: var(--z-content);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-overlay);
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

.payment-demo ::v-deep .payment-demo__login {
  padding: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
}

.payment-demo ::v-deep .payment-demo__login span {
  color: inherit;
}

.payment-demo ::v-deep .payment-demo__buy {
  position: absolute;
  right: var(--space-16);
  bottom: calc(var(--space-32) + var(--safe-bottom));
  z-index: var(--z-content);
  height: var(--payment-buy-height);
  padding: 0 var(--space-16);
  border: 0;
  border-radius: var(--radius-4);
  background: var(--color-payment-primary);
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-medium);
}

.payment-demo ::v-deep .payment-demo__buy span {
  color: inherit;
}

.payment-toast-stack {
  position: absolute;
  top: var(--payment-toast-top);
  left: 50%;
  z-index: var(--z-toast);
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
  width: var(--payment-toast-icon);
  height: var(--payment-toast-icon);
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
