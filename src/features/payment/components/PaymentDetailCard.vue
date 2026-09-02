<script setup lang="ts">
import { detailLabel, paymentCopy } from '../data/copy'
import type { PaymentOrderDetail } from '../data/types'
import iconSteam from '../assets/icon-steam.svg'
import PaymentCopyButton from './PaymentCopyButton.vue'

defineProps<{
  details: PaymentOrderDetail[]
}>()

const emit = defineEmits<{
  'copy-text': [text: string]
}>()
</script>

<template>
  <dl v-if="details.length" class="payment-detail">
    <div v-for="row in details" :key="row.key" class="payment-detail__row">
      <dt>{{ detailLabel(row.key) }}</dt>
      <dd>
        <img
          v-if="row.platformIcon === 'steam'"
          class="payment-detail__platform"
          :src="iconSteam"
          alt=""
        />
        <span class="payment-detail__value" :class="{ 'is-copyable': row.copyable }">
          <span>{{ row.value }}</span>
          <PaymentCopyButton
            v-if="row.copyable"
            :label="paymentCopy.copyOrder"
            @copy="emit('copy-text', row.value)"
          />
        </span>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.payment-detail {
  margin: 0;
  width: 100%;
  min-height: 0;
  padding: 0 var(--space-16);
  overflow: auto;
}

.payment-detail__row {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  min-height: var(--payment-detail-row-height);
  padding: var(--space-12) var(--space-16);
}

.payment-detail__row dt {
  flex-shrink: 0;
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-detail__row dd {
  display: flex;
  flex: 1;
  gap: var(--space-4);
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  margin: 0;
  color: var(--color-payment-detail-value);
  font-size: var(--font-size-14);
  line-height: normal;
  text-align: right;
}

.payment-detail__value {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  min-width: 0;
}

.payment-detail__value.is-copyable {
  gap: var(--space-8);
}

.payment-detail__value.is-copyable > span {
  color: var(--color-payment-amount);
}

.payment-detail__value > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-detail__platform {
  width: var(--payment-platform-icon);
  height: var(--payment-platform-icon);
  flex-shrink: 0;
}
</style>
