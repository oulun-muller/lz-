<script setup lang="ts">
import { paymentCopy } from '../data/copy'
import type { PaymentOrder } from '../data/types'

defineProps<{
  order: PaymentOrder
}>()
</script>

<template>
  <div class="payment-amount">
    <p class="payment-amount__label">{{ paymentCopy.amountLabel }}</p>
    <p class="payment-amount__row">
      <span class="payment-amount__symbol">{{ order.currencySymbol }}</span><span class="payment-amount__value">{{ order.amount }}</span>
    </p>
  </div>
</template>

<style scoped>
.payment-amount {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  padding-bottom: var(--space-16);
  text-align: center;
}

.payment-amount__label {
  margin: 0;
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: var(--payment-label-line);
}

.payment-amount__row {
  display: flex;
  gap: var(--space-4);
  align-items: flex-end;
  justify-content: center;
  margin: 0;
  color: var(--color-payment-amount);
  font-family: var(--font-family-number);
  font-weight: var(--font-weight-medium);
}

.payment-amount__symbol {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-medium);
  line-height: var(--payment-amount-symbol-leading);
}

.payment-amount__value {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-medium);
  line-height: var(--payment-amount-line);
}
</style>
