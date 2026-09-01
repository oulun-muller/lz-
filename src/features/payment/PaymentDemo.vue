<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  retryPay,
  openActivation,
  backFromActivation,
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

function onCopyCode() {
  const text = paymentOrder.value.activationCode
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
    <main class="payment-demo__hero">
      <p class="payment-demo__kicker">Figma 760:2674</p>
      <h1 class="payment-demo__title">支付弹窗流程 Demo</h1>
      <p class="payment-demo__desc">
        Phone 底部弹窗 · Pad 居中弹窗 · 同一组件通过 placement 切换
      </p>
      <el-button type="primary" size="medium" @click="openPayment">
        {{ paymentCopy.payNow }}
      </el-button>
    </main>

    <PaymentDialog
      :visible="paymentVisible"
      :placement="paymentPlacement"
      :step="paymentStep"
      :method="paymentMethod"
      :order="paymentOrder"
      @close="closePayment"
      @select-method="selectMethod"
      @submit-pay="submitPay"
      @retry-pay="retryPay"
      @open-activation="openActivation"
      @back-from-activation="backFromActivation"
      @copy-code="onCopyCode"
    />
  </div>
</template>

<style scoped>
.payment-demo {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 70% 40% at 50% 0%, rgba(56, 110, 254, 0.22), transparent 70%),
    var(--color-bg-page);
}

.payment-demo__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: calc(var(--space-32) + var(--safe-top)) var(--page-padding)
    calc(var(--space-32) + var(--safe-bottom));
  text-align: center;
}

.payment-demo__kicker {
  margin: 0 0 var(--space-8);
  color: var(--color-accent-strong);
  font-size: var(--font-size-13);
  letter-spacing: 0.06em;
}

.payment-demo__title {
  margin: 0 0 var(--space-12);
  font-size: clamp(24px, 6vw, var(--font-size-32));
  font-weight: var(--font-weight-semibold);
}

.payment-demo__desc {
  max-width: 320px;
  margin: 0 0 var(--space-24);
  color: var(--color-text-secondary);
  font-size: var(--font-size-14);
  line-height: var(--line-height-normal);
}
</style>
