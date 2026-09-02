<script setup lang="ts">
import { computed } from 'vue'
import { paymentCopy } from '../data/copy'
import iconCaution from '../assets/icon-caution.svg'
import iconLoading from '../assets/icon-loading.svg'
import iconPageEmpty from '../assets/icon-page-empty.svg'

const props = defineProps<{
  variant: 'loading' | 'allocating' | 'failure' | 'page-loading' | 'page-empty'
}>()

const title = computed(() => {
  if (props.variant === 'allocating') return paymentCopy.allocating
  if (props.variant === 'failure') return paymentCopy.payFailed
  if (props.variant === 'page-loading') return paymentCopy.pageLoading
  if (props.variant === 'page-empty') return paymentCopy.pageEmpty
  return paymentCopy.waitingPay
})

const hint = computed(() => {
  if (props.variant === 'allocating') return paymentCopy.allocatingHint
  if (props.variant === 'failure') return paymentCopy.payFailedHint
  if (props.variant === 'page-loading' || props.variant === 'page-empty') return ''
  return paymentCopy.waitingPayHint
})

const showSpinner = computed(
  () => props.variant === 'loading' || props.variant === 'allocating' || props.variant === 'page-loading',
)
</script>

<template>
  <div class="payment-status">
    <div v-if="showSpinner" class="payment-status__spinner-wrap">
      <img class="payment-status__spinner" :src="iconLoading" alt="" />
    </div>
    <img
      v-else-if="variant === 'page-empty'"
      class="payment-status__empty"
      :src="iconPageEmpty"
      alt=""
    />
    <img v-else class="payment-status__caution" :src="iconCaution" alt="" />
    <p class="payment-status__title">{{ title }}</p>
    <p v-if="hint" class="payment-status__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.payment-status {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.payment-status__spinner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--payment-spinner-wrap);
  height: var(--payment-spinner-wrap);
}

.payment-status__spinner {
  width: var(--payment-spinner);
  height: var(--payment-spinner);
  animation: payment-spin 0.9s linear infinite;
}

.payment-status__caution {
  width: var(--payment-caution);
  height: var(--payment-caution);
}

.payment-status__empty {
  display: block;
  width: var(--payment-empty-icon);
  height: var(--payment-empty-icon);
}

.payment-status__title {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-status__hint {
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
  line-height: normal;
}

@keyframes payment-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
