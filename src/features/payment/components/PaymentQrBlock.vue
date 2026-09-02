<script setup lang="ts">
import { paymentCopy } from '../data/copy'
import iconAlipay from '../assets/icon-alipay.svg'
import iconWechat from '../assets/icon-wechat.svg'
import qrCodeImage from '../assets/mock-qrcode.png'

defineProps<{
  alt: string
}>()
</script>

<template>
  <div class="payment-qr">
    <div class="payment-qr__wrap">
      <img
        class="payment-qr__image"
        :src="qrCodeImage"
        width="140"
        height="140"
        :alt="alt"
      />
    </div>
    <p class="payment-qr__hint">
      <span>{{ paymentCopy.qrHintPrefix }}</span>
      <span class="payment-qr__brand">
        <img :src="iconWechat" alt="" />
        <span>{{ paymentCopy.wechat }}</span>
      </span>
      <span>{{ paymentCopy.qrHintOr }}</span>
      <span class="payment-qr__brand">
        <img :src="iconAlipay" alt="" />
        <span>{{ paymentCopy.alipay }}</span>
      </span>
      <span>{{ paymentCopy.qrHintSuffix }}</span>
    </p>
  </div>
</template>

<style scoped>
.payment-qr {
  display: flex;
  flex-direction: column;
  gap: var(--space-48);
  align-items: center;
}

.payment-qr__wrap {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: var(--payment-qr-frame);
  height: var(--payment-qr-frame);
  padding: calc((var(--payment-qr-frame) - var(--payment-qr-size) - var(--payment-qr-border) * 2) / 2);
  border: var(--payment-qr-border) solid var(--color-border-subtle);
}

.payment-qr__image {
  display: block;
  width: var(--payment-qr-size);
  height: var(--payment-qr-size);
  object-fit: cover;
}

.payment-qr__hint {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
  margin: 0;
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
  line-height: normal;
  text-align: center;
  white-space: nowrap;
}

.payment-qr__brand {
  display: inline-flex;
  gap: var(--space-4);
  align-items: center;
  color: var(--color-payment-amount);
}

.payment-qr__brand img {
  width: var(--payment-method-icon);
  height: var(--payment-method-icon);
}
</style>
