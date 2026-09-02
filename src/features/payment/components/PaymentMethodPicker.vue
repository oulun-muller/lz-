<script setup lang="ts">
import { paymentCopy } from '../data/copy'
import type { PaymentMethod } from '../data/types'
import iconAlipay from '../assets/icon-alipay.svg'
import iconMethodSelected from '../assets/icon-method-selected.svg'
import iconWechat from '../assets/icon-wechat.svg'

defineProps<{
  method: PaymentMethod
}>()

const emit = defineEmits<{
  'select-method': [method: PaymentMethod]
}>()
</script>

<template>
  <div class="payment-methods">
    <p class="payment-methods__label">{{ paymentCopy.payMethodLabel }}</p>
    <div class="payment-methods__grid">
      <button
        type="button"
        class="payment-methods__item"
        :class="{ 'is-selected': method === 'wechat' }"
        @click="emit('select-method', 'wechat')"
      >
        <img class="payment-methods__icon" :src="iconWechat" alt="" />
        <span>{{ paymentCopy.wechat }}</span>
        <img
          v-if="method === 'wechat'"
          class="payment-methods__check"
          :src="iconMethodSelected"
          alt=""
        />
      </button>
      <button
        type="button"
        class="payment-methods__item"
        :class="{ 'is-selected': method === 'alipay' }"
        @click="emit('select-method', 'alipay')"
      >
        <img class="payment-methods__icon" :src="iconAlipay" alt="" />
        <span>{{ paymentCopy.alipay }}</span>
        <img
          v-if="method === 'alipay'"
          class="payment-methods__check"
          :src="iconMethodSelected"
          alt=""
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
  padding: 0 var(--space-16);
}

.payment-methods__label {
  margin: 0;
  color: var(--color-payment-method-label);
  font-size: var(--font-size-14);
  line-height: normal;
}

.payment-methods__grid {
  display: flex;
  gap: var(--space-8);
  width: 100%;
}

.payment-methods__item {
  position: relative;
  display: flex;
  flex: 1;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
  height: var(--payment-method-height);
  padding: var(--space-8) var(--space-16);
  overflow: hidden;
  border: var(--border-width-1) solid transparent;
  border-radius: var(--radius-4);
  background: var(--color-payment-card);
  color: var(--color-payment-detail-value);
  font-size: var(--font-size-14);
  cursor: pointer;
}

.payment-methods__item.is-selected {
  border-color: var(--color-payment-primary-border);
}

.payment-methods__icon {
  width: var(--payment-method-icon);
  height: var(--payment-method-icon);
}

.payment-methods__check {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: var(--payment-method-check);
  height: var(--payment-method-check);
}
</style>
