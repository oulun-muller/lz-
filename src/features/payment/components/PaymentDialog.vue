<script setup lang="ts">
import { computed } from 'vue'
import { paymentCopy } from '../data/copy'
import type {
  ActivationStep,
  PaymentMethod,
  PaymentOrder,
  PaymentPlacement,
  PaymentStep,
} from '../data/types'
import iconBack from '../assets/icon-back.svg'
import iconClose from '../assets/icon-close.svg'
import PaymentActivationView from './PaymentActivationView.vue'
import PaymentAmountBlock from './PaymentAmountBlock.vue'
import PaymentDetailCard from './PaymentDetailCard.vue'
import PaymentMethodPicker from './PaymentMethodPicker.vue'
import PaymentQrBlock from './PaymentQrBlock.vue'
import PaymentStatusView from './PaymentStatusView.vue'
import PaymentSuccessHead from './PaymentSuccessHead.vue'

const props = defineProps<{
  visible: boolean
  placement: PaymentPlacement
  step: PaymentStep
  method: PaymentMethod
  order: PaymentOrder
  activationSteps: ActivationStep[]
}>()

const emit = defineEmits<{
  close: []
  back: []
  'select-method': [method: PaymentMethod]
  'submit-pay': []
  'open-activation': []
  'copy-text': [text: string]
}>()

const dialogClass = computed(() =>
  props.placement === 'bottom'
    ? 'payment-dialog payment-dialog--bottom'
    : 'payment-dialog payment-dialog--center',
)

const showBack = computed(() =>
  ['qrcode', 'loading', 'failure', 'activation'].includes(props.step),
)

const showDualActions = computed(() => props.step === 'success')
const showPayAction = computed(() => props.step === 'confirm')
const showBackAction = computed(() => props.step === 'failure')
const showFooterSpacer = computed(() =>
  ['qrcode', 'loading', 'allocating'].includes(props.step),
)

const successDetails = computed(() => [
  ...props.order.details,
  {
    key: 'orderNo',
    value: props.order.orderNo,
    copyable: true,
  },
])
</script>

<template>
  <div
    class="payment-layer"
    :class="placement === 'bottom' ? 'is-sheet' : 'is-modal'"
  >
    <el-dialog
      :visible="visible"
      :custom-class="dialogClass"
      :modal-append-to-body="false"
      :append-to-body="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="false"
      width="100%"
      @close="emit('close')"
    >
      <header class="payment-dialog__header">
        <button
          v-if="showBack"
          type="button"
          class="payment-dialog__icon-btn"
          :aria-label="paymentCopy.back"
          @click.stop="emit('back')"
        >
          <img class="payment-dialog__icon" :src="iconBack" alt="" />
        </button>
        <button
          type="button"
          class="payment-dialog__icon-btn payment-dialog__icon-btn--close"
          :aria-label="paymentCopy.close"
          @click.stop="emit('close')"
        >
          <img class="payment-dialog__icon" :src="iconClose" alt="" />
        </button>
      </header>

      <div class="payment-dialog__body" :class="`is-${step}`">
        <template v-if="step === 'confirm'">
          <PaymentAmountBlock :order="order" />
          <PaymentDetailCard :details="order.details" />
          <PaymentMethodPicker :method="method" @select-method="emit('select-method', $event)" />
        </template>

        <template v-else-if="step === 'qrcode'">
          <PaymentAmountBlock :order="order" />
          <PaymentQrBlock :alt="paymentCopy.qrHintSuffix" />
        </template>

        <PaymentStatusView v-else-if="step === 'loading'" variant="loading" />
        <PaymentStatusView v-else-if="step === 'allocating'" variant="allocating" />

        <template v-else-if="step === 'success'">
          <PaymentSuccessHead :order="order" @copy-text="emit('copy-text', $event)" />
          <PaymentDetailCard :details="successDetails" @copy-text="emit('copy-text', $event)" />
        </template>

        <PaymentStatusView v-else-if="step === 'failure'" variant="failure" />

        <PaymentActivationView
          v-else-if="step === 'activation'"
          :activation-code="order.activationCode"
          :steps="activationSteps"
          :active="visible && step === 'activation'"
          @copy-text="emit('copy-text', $event)"
        />
      </div>

      <footer
        v-if="showPayAction || showDualActions || showBackAction"
        class="payment-dialog__footer"
      >
        <template v-if="showDualActions">
          <button
            type="button"
            class="payment-dialog__btn payment-dialog__btn--secondary"
            @click="emit('open-activation')"
          >
            {{ paymentCopy.viewActivation }}
          </button>
          <button
            type="button"
            class="payment-dialog__btn payment-dialog__btn--primary"
            @click="emit('close')"
          >
            {{ paymentCopy.done }}
          </button>
        </template>
        <button
          v-else-if="showPayAction"
          type="button"
          class="payment-dialog__btn payment-dialog__btn--primary payment-dialog__btn--full"
          @click="emit('submit-pay')"
        >
          {{ paymentCopy.payNow }}
        </button>
        <button
          v-else-if="showBackAction"
          type="button"
          class="payment-dialog__btn payment-dialog__btn--secondary payment-dialog__btn--full"
          @click="emit('back')"
        >
          {{ paymentCopy.back }}
        </button>
      </footer>
      <div
        v-else-if="showFooterSpacer"
        class="payment-dialog__footer payment-dialog__footer--spacer"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.payment-dialog__header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: var(--payment-header-height);
}

.payment-dialog__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--payment-icon-btn);
  height: var(--payment-icon-btn);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.payment-dialog__icon-btn--close {
  margin-left: auto;
}

.payment-dialog__icon {
  display: block;
  width: var(--payment-icon);
  height: var(--payment-icon);
}

.payment-dialog__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-24);
  min-height: 0;
  padding: 0 var(--space-16);
  overflow: hidden;
}

.payment-dialog__body.is-qrcode {
  gap: var(--space-16);
  align-items: center;
  justify-content: center;
}

.payment-dialog__body.is-activation {
  gap: 0;
  padding: 0;
  overflow: hidden;
}

.payment-dialog__footer {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-16);
  padding: var(--space-16);
}

.payment-dialog__footer--spacer {
  height: var(--payment-footer-spacer);
  padding: var(--space-16);
}

.payment-dialog__btn {
  flex: 1;
  height: var(--payment-btn-height);
  border: 0;
  border-radius: var(--radius-4);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-medium);
  line-height: var(--payment-btn-line);
  cursor: pointer;
}

.payment-dialog__btn--full {
  width: 100%;
}

.payment-dialog__btn--primary {
  background: var(--color-payment-primary);
  color: var(--color-payment-amount);
}

.payment-dialog__btn--secondary {
  background: var(--color-payment-secondary-btn);
  color: var(--color-payment-amount);
}
</style>

<style>
.payment-layer {
  position: absolute;
  inset: 0;
  z-index: var(--z-payment);
  pointer-events: none;
}

.payment-layer .el-dialog__wrapper,
.payment-layer .v-modal {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.payment-layer .v-modal {
  z-index: calc(var(--z-payment) - 1) !important;
  background: var(--color-overlay) !important;
}

.payment-layer .el-dialog__wrapper {
  z-index: var(--z-payment) !important;
  overflow: hidden;
}

.payment-dialog.el-dialog {
  display: flex;
  flex-direction: column;
  height: var(--payment-dialog-height);
  margin: 0 !important;
  overflow: hidden;
  background: var(--color-payment-surface);
  box-shadow: var(--payment-dialog-shadow);
}

.payment-dialog .el-dialog__header {
  display: none;
}

.payment-dialog .el-dialog__body {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0;
  overflow: hidden;
  color: var(--color-payment-amount);
}

.payment-dialog--bottom.el-dialog {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  top: auto !important;
  width: 100% !important;
  max-width: 100%;
  border-radius: var(--payment-dialog-radius) var(--payment-dialog-radius) 0 0;
}

.payment-dialog--center.el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  width: min(var(--payment-dialog-width-pad), calc(100% - var(--space-32))) !important;
  max-width: var(--payment-dialog-width-pad);
  border-radius: var(--payment-dialog-radius);
  transform: translate(-50%, -50%);
}

.payment-layer.is-sheet .el-dialog__wrapper.dialog-fade-enter-active,
.payment-layer.is-sheet .dialog-fade-enter-active {
  animation: payment-sheet-in var(--payment-sheet-in-duration) cubic-bezier(0.22, 1, 0.36, 1) both !important;
}

.payment-layer.is-sheet .el-dialog__wrapper.dialog-fade-leave-active,
.payment-layer.is-sheet .dialog-fade-leave-active {
  animation: payment-sheet-out var(--payment-sheet-out-duration) cubic-bezier(0.4, 0, 1, 1) both !important;
}

@keyframes payment-sheet-in {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes payment-sheet-out {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(0, 100%, 0);
    opacity: 1;
  }
}
</style>
