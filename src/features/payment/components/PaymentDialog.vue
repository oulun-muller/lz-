<script setup lang="ts">
import { computed } from 'vue'
import { paymentCopy } from '../data/copy'
import { activationSteps, qrCodeImage } from '../data/mock'
import type {
  PaymentMethod,
  PaymentOrder,
  PaymentPlacement,
  PaymentStep,
} from '../data/types'
import iconAlipay from '../assets/icon-alipay.svg'
import iconBack from '../assets/icon-back.svg'
import iconCaution from '../assets/icon-caution.svg'
import iconCheckSuccess from '../assets/icon-check-success.svg'
import iconClose from '../assets/icon-close.svg'
import iconCopy from '../assets/icon-copy.svg'
import iconMethodSelected from '../assets/icon-method-selected.svg'
import iconSteam from '../assets/icon-steam.svg'
import iconWechat from '../assets/icon-wechat.svg'

const props = defineProps<{
  visible: boolean
  placement: PaymentPlacement
  step: PaymentStep
  method: PaymentMethod
  order: PaymentOrder
}>()

const emit = defineEmits<{
  close: []
  'select-method': [method: PaymentMethod]
  'submit-pay': []
  'retry-pay': []
  'open-activation': []
  'back-from-activation': []
  'copy-code': []
}>()

const dialogClass = computed(() =>
  props.placement === 'bottom'
    ? 'payment-dialog payment-dialog--bottom'
    : 'payment-dialog payment-dialog--center',
)

const showClose = computed(() => props.step !== 'loading')
const showBack = computed(() => props.step === 'activation')
const showDualActions = computed(() => props.step === 'success')
const showPrimaryAction = computed(
  () => props.step === 'confirm' || props.step === 'failure',
)

const headerTitle = computed(() => {
  if (props.step === 'activation') return paymentCopy.viewActivation
  return ''
})

const successDetails = computed(() => [
  ...props.order.details,
  {
    key: 'orderNo',
    label: '订单号',
    value: props.order.orderNo,
    copyable: true,
  },
])

function onDialogClose() {
  if (props.step === 'loading') return
  emit('close')
}
</script>

<template>
  <el-dialog
    :visible="visible"
    :custom-class="dialogClass"
    :modal-append-to-body="true"
    :close-on-click-modal="step !== 'loading'"
    :close-on-press-escape="step !== 'loading'"
    :show-close="false"
    width="100%"
    @close="onDialogClose"
  >
    <header class="payment-dialog__header">
      <button
        v-if="showBack"
        type="button"
        class="payment-dialog__icon-btn"
        aria-label="back"
        @click="emit('back-from-activation')"
      >
        <img class="payment-dialog__icon" :src="iconBack" alt="" />
      </button>
      <span v-if="headerTitle" class="payment-dialog__title">{{ headerTitle }}</span>
      <button
        v-if="showClose"
        type="button"
        class="payment-dialog__icon-btn payment-dialog__icon-btn--close"
        aria-label="close"
        @click="emit('close')"
      >
        <img class="payment-dialog__icon" :src="iconClose" alt="" />
      </button>
    </header>

    <div class="payment-dialog__body">
      <!-- Confirm -->
      <template v-if="step === 'confirm'">
        <div class="payment-dialog__amount-block">
          <p class="payment-dialog__amount-label">{{ paymentCopy.amountLabel }}</p>
          <p class="payment-dialog__amount">
            <span class="payment-dialog__amount-symbol">{{ order.currencySymbol }}</span>
            <span class="payment-dialog__amount-value">{{ order.amount }}</span>
          </p>
        </div>

        <dl class="payment-dialog__detail-card">
          <div
            v-for="row in order.details"
            :key="row.key"
            class="payment-dialog__detail-row"
          >
            <dt>{{ row.label }}</dt>
            <dd>
              <img
                v-if="row.platformIcon === 'steam'"
                class="payment-dialog__platform-icon"
                :src="iconSteam"
                alt=""
              />
              <span>{{ row.value }}</span>
            </dd>
          </div>
        </dl>

        <div class="payment-dialog__methods">
          <p class="payment-dialog__methods-label">{{ paymentCopy.payMethodLabel }}</p>
          <div class="payment-dialog__methods-grid">
            <button
              type="button"
              class="payment-dialog__method"
              :class="{ 'is-selected': method === 'wechat' }"
              @click="emit('select-method', 'wechat')"
            >
              <img class="payment-dialog__method-icon" :src="iconWechat" alt="" />
              <span>{{ paymentCopy.wechat }}</span>
              <img
                v-if="method === 'wechat'"
                class="payment-dialog__method-check"
                :src="iconMethodSelected"
                alt=""
              />
            </button>
            <button
              type="button"
              class="payment-dialog__method"
              :class="{ 'is-selected': method === 'alipay' }"
              @click="emit('select-method', 'alipay')"
            >
              <img class="payment-dialog__method-icon" :src="iconAlipay" alt="" />
              <span>{{ paymentCopy.alipay }}</span>
              <img
                v-if="method === 'alipay'"
                class="payment-dialog__method-check"
                :src="iconMethodSelected"
                alt=""
              />
            </button>
          </div>
        </div>
      </template>

      <!-- QR Code -->
      <template v-else-if="step === 'qrcode'">
        <div class="payment-dialog__amount-block">
          <p class="payment-dialog__amount-label">{{ paymentCopy.amountLabel }}</p>
          <p class="payment-dialog__amount">
            <span class="payment-dialog__amount-symbol">{{ order.currencySymbol }}</span>
            <span class="payment-dialog__amount-value">{{ order.amount }}</span>
          </p>
        </div>
        <div class="payment-dialog__qr-wrap">
          <img class="payment-dialog__qr" :src="qrCodeImage" alt="payment qrcode" />
        </div>
        <p class="payment-dialog__qr-hint">
          <span>{{ paymentCopy.qrHintPrefix }}</span>
          <span class="payment-dialog__qr-brand">
            <img :src="iconWechat" alt="" />
            {{ paymentCopy.wechat }}
          </span>
          <span>{{ paymentCopy.qrHintOr }}</span>
          <span class="payment-dialog__qr-brand">
            <img :src="iconAlipay" alt="" />
            {{ paymentCopy.alipay }}
          </span>
          <span>{{ paymentCopy.qrHintSuffix }}</span>
        </p>
      </template>

      <!-- Loading -->
      <template v-else-if="step === 'loading'">
        <div class="payment-dialog__status">
          <div class="payment-dialog__spinner" aria-hidden="true" />
          <p class="payment-dialog__status-title">{{ paymentCopy.paying }}</p>
          <p class="payment-dialog__status-hint">
            {{ paymentCopy.amountLabel }}：{{ order.currencySymbol }}{{ order.amount }}
          </p>
        </div>
      </template>

      <!-- Success -->
      <template v-else-if="step === 'success'">
        <div class="payment-dialog__success-head">
          <img class="payment-dialog__success-icon" :src="iconCheckSuccess" alt="" />
          <p class="payment-dialog__success-title">{{ paymentCopy.activationGenerated }}</p>
          <div class="payment-dialog__code-row">
            <span class="payment-dialog__code-label">{{ paymentCopy.activationCodeLabel }}</span>
            <span class="payment-dialog__code-value">{{ order.activationCode }}</span>
            <button
              type="button"
              class="payment-dialog__copy-btn"
              :aria-label="paymentCopy.copyCode"
              @click="emit('copy-code')"
            >
              <img :src="iconCopy" alt="" />
            </button>
          </div>
        </div>
        <dl class="payment-dialog__detail-card">
          <div
            v-for="row in successDetails"
            :key="row.key"
            class="payment-dialog__detail-row"
          >
            <dt>{{ row.label }}</dt>
            <dd>
              <img
                v-if="row.platformIcon === 'steam'"
                class="payment-dialog__platform-icon"
                :src="iconSteam"
                alt=""
              />
              <span>{{ row.value }}</span>
              <button
                v-if="row.copyable"
                type="button"
                class="payment-dialog__copy-btn payment-dialog__copy-btn--inline"
                @click="emit('copy-code')"
              >
                <img :src="iconCopy" alt="" />
              </button>
            </dd>
          </div>
        </dl>
      </template>

      <!-- Failure -->
      <template v-else-if="step === 'failure'">
        <div class="payment-dialog__status">
          <img class="payment-dialog__caution-icon" :src="iconCaution" alt="" />
          <p class="payment-dialog__status-title">{{ paymentCopy.payFailed }}</p>
          <p class="payment-dialog__status-hint">{{ paymentCopy.payFailedHint }}</p>
        </div>
      </template>

      <!-- Activation guide -->
      <template v-else-if="step === 'activation'">
        <div class="payment-dialog__activation-code">
          <span>{{ paymentCopy.activationGuideTitle }}</span>
          <span>{{ order.activationCode }}</span>
          <button type="button" class="payment-dialog__copy-btn" @click="emit('copy-code')">
            <img :src="iconCopy" alt="" />
          </button>
        </div>
        <div class="payment-dialog__divider" />
        <div class="payment-dialog__activation-scroll">
          <article
            v-for="(item, index) in activationSteps"
            :key="index"
            class="payment-dialog__activation-step"
          >
            <p class="payment-dialog__activation-title">{{ item.title }}</p>
            <img class="payment-dialog__activation-image" :src="item.image" :alt="item.title" />
          </article>
        </div>
      </template>
    </div>

    <footer v-if="showPrimaryAction || showDualActions" class="payment-dialog__footer">
      <template v-if="showDualActions">
        <button
          type="button"
          class="payment-dialog__btn payment-dialog__btn--secondary"
          @click="emit('open-activation')"
        >
          {{ paymentCopy.viewActivation }}
        </button>
        <button type="button" class="payment-dialog__btn payment-dialog__btn--primary" @click="emit('close')">
          {{ paymentCopy.done }}
        </button>
      </template>
      <button
        v-else-if="step === 'confirm'"
        type="button"
        class="payment-dialog__btn payment-dialog__btn--primary payment-dialog__btn--full"
        @click="emit('submit-pay')"
      >
        {{ paymentCopy.payNow }}
      </button>
      <button
        v-else-if="step === 'failure'"
        type="button"
        class="payment-dialog__btn payment-dialog__btn--primary payment-dialog__btn--full"
        @click="emit('retry-pay')"
      >
        {{ paymentCopy.retryPay }}
      </button>
    </footer>
  </el-dialog>
</template>

<style scoped>
.payment-dialog__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 48px;
  padding: 0 var(--space-4);
}

.payment-dialog__header:has(.payment-dialog__title) {
  justify-content: space-between;
}

.payment-dialog__title {
  flex: 1;
  padding-left: var(--space-12);
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-semibold);
}

.payment-dialog__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.payment-dialog__icon-btn--close {
  margin-left: auto;
}

.payment-dialog__icon {
  width: 32px;
  height: 32px;
}

.payment-dialog__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-24);
  min-height: 0;
  padding: 0 var(--space-16) var(--space-16);
}

.payment-dialog__amount-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: center;
  padding-bottom: var(--space-16);
  text-align: center;
}

.payment-dialog__amount-label {
  margin: 0;
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
}

.payment-dialog__amount {
  margin: 0;
  color: var(--color-payment-amount);
  line-height: 1;
}

.payment-dialog__amount-symbol {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-semibold);
}

.payment-dialog__amount-value {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-semibold);
}

.payment-dialog__detail-card {
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-4);
  background: var(--color-payment-card);
}

.payment-dialog__detail-row {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-16);
}

.payment-dialog__detail-row dt {
  flex-shrink: 0;
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
}

.payment-dialog__detail-row dd {
  display: flex;
  flex: 1;
  gap: var(--space-4);
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  margin: 0;
  color: var(--color-payment-detail-value);
  font-size: var(--font-size-14);
  text-align: right;
}

.payment-dialog__detail-row dd span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-dialog__platform-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.payment-dialog__methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
}

.payment-dialog__methods-label {
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
}

.payment-dialog__methods-grid {
  display: flex;
  gap: var(--space-8);
  width: 100%;
}

.payment-dialog__method {
  position: relative;
  display: flex;
  flex: 1;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: var(--space-8) var(--space-16);
  overflow: hidden;
  border: var(--border-width-1) solid transparent;
  border-radius: var(--radius-4);
  background: var(--color-payment-card);
  color: var(--color-payment-detail-value);
  font-size: var(--font-size-14);
  cursor: pointer;
}

.payment-dialog__method.is-selected {
  border-color: var(--color-payment-primary-border);
}

.payment-dialog__method-icon {
  width: 24px;
  height: 24px;
}

.payment-dialog__method-check {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 20px;
  height: 20px;
}

.payment-dialog__qr-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  border: 2px solid var(--color-border-subtle);
}

.payment-dialog__qr {
  width: 140px;
  height: 140px;
  object-fit: cover;
}

.payment-dialog__qr-hint {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
  margin: 0;
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
  text-align: center;
}

.payment-dialog__qr-brand {
  display: inline-flex;
  gap: var(--space-4);
  align-items: center;
  color: var(--color-payment-amount);
}

.payment-dialog__qr-brand img {
  width: 24px;
  height: 24px;
}

.payment-dialog__status {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  justify-content: center;
  min-height: 280px;
  text-align: center;
}

.payment-dialog__spinner {
  width: 56px;
  height: 56px;
  border: 3px solid rgba(234, 247, 255, 0.16);
  border-top-color: var(--color-payment-primary);
  border-radius: 50%;
  animation: payment-spin 0.9s linear infinite;
}

.payment-dialog__caution-icon {
  width: 80px;
  height: 80px;
}

.payment-dialog__status-title {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
}

.payment-dialog__status-hint {
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
}

.payment-dialog__success-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  padding-bottom: var(--space-16);
  text-align: center;
}

.payment-dialog__success-icon {
  width: 48px;
  height: 48px;
}

.payment-dialog__success-title {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
}

.payment-dialog__code-row,
.payment-dialog__activation-code {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
}

.payment-dialog__code-label {
  color: var(--color-payment-label);
  font-size: var(--font-size-16);
}

.payment-dialog__code-value {
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
}

.payment-dialog__copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.payment-dialog__copy-btn img,
.payment-dialog__copy-btn--inline img {
  width: 18px;
  height: 18px;
}

.payment-dialog__divider {
  height: var(--border-width-hairline);
  background: var(--color-border-subtle);
}

.payment-dialog__activation-scroll {
  flex: 1;
  min-height: 0;
  max-height: 420px;
  overflow-y: auto;
}

.payment-dialog__activation-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  margin-bottom: var(--space-24);
  text-align: center;
}

.payment-dialog__activation-title {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  line-height: 26px;
  white-space: pre-wrap;
}

.payment-dialog__activation-image {
  width: 100%;
  border-radius: var(--radius-4);
}

.payment-dialog__footer {
  display: flex;
  gap: var(--space-16);
  padding: var(--space-16);
}

.payment-dialog__btn {
  flex: 1;
  height: 54px;
  border: 0;
  border-radius: var(--radius-4);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-semibold);
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

@keyframes payment-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.payment-dialog.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  overflow: hidden;
  background: var(--color-payment-surface);
  box-shadow: var(--payment-dialog-shadow);
}

.payment-dialog .el-dialog__header {
  display: none;
}

.payment-dialog .el-dialog__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0;
  color: var(--color-payment-amount);
}

.payment-dialog--bottom.el-dialog {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100% !important;
  max-width: 100%;
  border-radius: var(--payment-dialog-radius) var(--payment-dialog-radius) 0 0;
}

.payment-dialog--center.el-dialog {
  top: 50%;
  width: min(var(--payment-dialog-width-pad), calc(100vw - 32px)) !important;
  max-width: var(--payment-dialog-width-pad);
  border-radius: var(--payment-dialog-radius);
  transform: translateY(-50%);
}

.payment-dialog--bottom .payment-dialog__body,
.payment-dialog--center .payment-dialog__body {
  max-height: min(460px, 62vh);
  overflow-y: auto;
}

.payment-dialog--center .payment-dialog__activation-scroll {
  max-height: 360px;
}

.v-modal {
  z-index: calc(var(--z-payment) - 1) !important;
}

.payment-dialog.el-dialog__wrapper {
  z-index: var(--z-payment) !important;
}
</style>
