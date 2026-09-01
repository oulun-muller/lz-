<script setup lang="ts">
import { computed, watch } from 'vue'
import { Message } from 'element-ui'
import PaymentDialog from './components/PaymentDialog.vue'
import { paymentCopy } from './data/copy'
import { defaultPaymentOrder } from './data/mock'
import type {
  PaymentDebugState,
  PaymentPlacement,
  PaymentStep,
} from './data/types'
import { usePayment } from './state/usePayment'
import { getDeviceType } from '@/shared/utils/viewport'
import landingHero from './assets/landing-hero.png'

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
  getDeviceType(props.viewportWidth) === 'phone' ? 'bottom' : 'center',
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

function onCopyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      Message.success(paymentCopy.copySuccess)
    })
    return
  }
  Message.success(paymentCopy.copySuccess)
}
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
  font-weight: 700;
  cursor: pointer;
}
</style>
