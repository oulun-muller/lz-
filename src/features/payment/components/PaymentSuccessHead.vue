<script setup lang="ts">
import { paymentCopy } from '../data/copy'
import type { PaymentOrder } from '../data/types'
import iconCheckSuccess from '../assets/icon-check-success.svg'
import PaymentCopyButton from './PaymentCopyButton.vue'

defineProps<{
  order: PaymentOrder
}>()

const emit = defineEmits<{
  'copy-text': [text: string]
}>()
</script>

<template>
  <div class="payment-success">
    <img class="payment-success__icon" :src="iconCheckSuccess" alt="" />
    <p class="payment-success__title">{{ paymentCopy.activationGenerated }}</p>
    <div class="payment-success__code">
      <span class="payment-success__label">{{ paymentCopy.activationCodeLabel }}</span>
      <span class="payment-success__group">
        <span class="payment-success__value">{{ order.activationCode }}</span>
        <PaymentCopyButton
          :label="paymentCopy.copyCode"
          @copy="emit('copy-text', order.activationCode)"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.payment-success {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
  padding: 0 var(--space-16) var(--space-16);
  text-align: center;
}

.payment-success__icon {
  width: var(--payment-success-icon);
  height: var(--payment-success-icon);
}

.payment-success__title {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-success__code {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.payment-success__label {
  flex-shrink: 0;
  color: var(--color-payment-code-label);
  font-size: var(--font-size-16);
  line-height: var(--payment-code-line);
  white-space: nowrap;
}

.payment-success__group {
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;
  min-width: 0;
}

.payment-success__value {
  min-width: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
  line-height: var(--payment-code-line);
  text-align: right;
  overflow-wrap: anywhere;
  word-break: break-all;
}
</style>
