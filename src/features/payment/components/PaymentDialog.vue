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
import iconLoading from '../assets/icon-loading.svg'
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
  emit('close')
}
</script>

<template>
  <el-dialog
    :visible="visible"
    :custom-class="dialogClass"
    :modal-append-to-body="false"
    :append-to-body="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="false"
    top="0"
    width="100%"
    @close="onDialogClose"
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

      <template v-else-if="step === 'qrcode'">
        <div class="payment-dialog__amount-block">
          <p class="payment-dialog__amount-label">{{ paymentCopy.amountLabel }}</p>
          <p class="payment-dialog__amount">
            <span class="payment-dialog__amount-symbol">{{ order.currencySymbol }}</span>
            <span class="payment-dialog__amount-value">{{ order.amount }}</span>
          </p>
        </div>
        <div class="payment-dialog__qr-block">
          <div class="payment-dialog__qr-wrap">
            <img class="payment-dialog__qr" :src="qrCodeImage" alt="" />
          </div>
          <p class="payment-dialog__qr-hint">
            <span>{{ paymentCopy.qrHintPrefix }}</span>
            <span class="payment-dialog__qr-brand">
              <img :src="iconWechat" alt="" />
              <span>{{ paymentCopy.wechat }}</span>
            </span>
            <span>{{ paymentCopy.qrHintOr }}</span>
            <span class="payment-dialog__qr-brand">
              <img :src="iconAlipay" alt="" />
              <span>{{ paymentCopy.alipay }}</span>
            </span>
            <span>{{ paymentCopy.qrHintSuffix }}</span>
          </p>
        </div>
      </template>

      <template v-else-if="step === 'loading'">
        <div class="payment-dialog__status">
          <div class="payment-dialog__spinner-wrap">
            <img class="payment-dialog__spinner-icon" :src="iconLoading" alt="" />
          </div>
          <p class="payment-dialog__status-title">{{ paymentCopy.waitingPay }}</p>
          <p class="payment-dialog__status-hint">{{ paymentCopy.waitingPayHint }}</p>
        </div>
      </template>

      <template v-else-if="step === 'allocating'">
        <div class="payment-dialog__status">
          <div class="payment-dialog__spinner-wrap">
            <img class="payment-dialog__spinner-icon" :src="iconLoading" alt="" />
          </div>
          <p class="payment-dialog__status-title">{{ paymentCopy.allocating }}</p>
          <p class="payment-dialog__status-hint">{{ paymentCopy.allocatingHint }}</p>
        </div>
      </template>

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
              @click="emit('copy-text', order.activationCode)"
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
                :aria-label="paymentCopy.copyOrder"
                @click="emit('copy-text', row.value)"
              >
                <img :src="iconCopy" alt="" />
              </button>
            </dd>
          </div>
        </dl>
      </template>

      <template v-else-if="step === 'failure'">
        <div class="payment-dialog__status">
          <img class="payment-dialog__caution-icon" :src="iconCaution" alt="" />
          <p class="payment-dialog__status-title">{{ paymentCopy.payFailed }}</p>
          <p class="payment-dialog__status-hint">{{ paymentCopy.payFailedHint }}</p>
        </div>
      </template>

      <template v-else-if="step === 'activation'">
        <div class="payment-dialog__activation-code">
          <span class="payment-dialog__activation-label">{{ paymentCopy.activationCodeLabel }}</span>
          <span class="payment-dialog__activation-value">{{ order.activationCode }}</span>
          <button
            type="button"
            class="payment-dialog__copy-btn"
            :aria-label="paymentCopy.copyCode"
            @click="emit('copy-text', order.activationCode)"
          >
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
            <p class="payment-dialog__activation-heading">{{ item.heading }}</p>
            <p class="payment-dialog__activation-body">{{ item.body }}</p>
            <img class="payment-dialog__activation-image" :src="item.image" :alt="item.heading" />
          </article>
        </div>
      </template>
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
    <div v-else class="payment-dialog__footer payment-dialog__footer--spacer" />
  </el-dialog>
</template>

<style scoped>
.payment-dialog__header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 48px;
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
  display: block;
  width: 32px;
  height: 32px;
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

.payment-dialog__body.is-activation {
  gap: var(--space-24);
  padding: 0;
  overflow: hidden;
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
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-dialog__amount {
  margin: 0;
  color: var(--color-payment-amount);
  line-height: 1;
}

.payment-dialog__amount-symbol {
  font-size: var(--font-size-24);
  font-weight: 700;
}

.payment-dialog__amount-value {
  font-size: var(--font-size-32);
  font-weight: 700;
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
  line-height: normal;
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
  line-height: normal;
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
  line-height: normal;
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

.payment-dialog__qr-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-48);
  align-items: center;
}

.payment-dialog__qr-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  border: 2px solid var(--color-border-subtle);
}

.payment-dialog__qr {
  display: block;
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
  line-height: normal;
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
  text-align: center;
}

.payment-dialog__spinner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
}

.payment-dialog__spinner-icon {
  width: 56px;
  height: 56px;
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
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-dialog__status-hint {
  margin: 0;
  color: var(--color-payment-detail-label);
  font-size: var(--font-size-14);
  line-height: normal;
}

.payment-dialog__success-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  padding: 0 var(--space-16) var(--space-48);
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
  font-weight: var(--font-weight-regular);
  line-height: normal;
}

.payment-dialog__code-row,
.payment-dialog__activation-code {
  display: flex;
  gap: var(--space-8);
  align-items: center;
  justify-content: center;
}

.payment-dialog__code-label {
  color: var(--color-payment-label);
  font-size: var(--font-size-16);
  line-height: normal;
}

.payment-dialog__code-value {
  color: var(--color-payment-amount);
  font-size: var(--font-size-16);
  line-height: normal;
}

.payment-dialog__activation-code {
  gap: var(--space-4);
  padding: 0 var(--space-16);
}

.payment-dialog__activation-label {
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
}

.payment-dialog__activation-value {
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
}

.payment-dialog__copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.payment-dialog__copy-btn img {
  display: block;
  width: 18px;
  height: 18px;
}

.payment-dialog__divider {
  flex-shrink: 0;
  height: 0.5px;
  background: var(--color-border-subtle);
}

.payment-dialog__activation-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 var(--space-16) var(--space-16);
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

.payment-dialog__activation-heading {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: 700;
  line-height: 26px;
}

.payment-dialog__activation-body {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: 26px;
}

.payment-dialog__activation-image {
  display: block;
  width: 100%;
}

.payment-dialog__footer {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-16);
  padding: var(--space-16);
}

.payment-dialog__footer--spacer {
  height: 86px;
  padding: var(--space-16);
}

.payment-dialog__btn {
  flex: 1;
  height: 54px;
  border: 0;
  border-radius: var(--radius-4);
  font-size: var(--font-size-16);
  font-weight: 700;
  line-height: 22px;
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
  background: #39404d;
  color: var(--color-payment-amount);
}

@keyframes payment-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<style>
.payment-demo .el-dialog__wrapper,
.payment-demo .v-modal {
  position: absolute;
  inset: 0;
}

.payment-demo .v-modal {
  z-index: calc(var(--z-payment) - 1) !important;
  background: rgba(0, 0, 0, 0.6) !important;
}

.payment-demo .el-dialog__wrapper {
  z-index: var(--z-payment) !important;
  overflow: hidden;
}

.payment-dialog.el-dialog {
  display: flex;
  flex-direction: column;
  height: 594px;
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
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  top: auto !important;
  width: 100% !important;
  max-width: 100%;
  border-radius: var(--payment-dialog-radius) var(--payment-dialog-radius) 0 0;
  transform: none;
}

.payment-dialog--center.el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  width: min(var(--payment-dialog-width-pad), calc(100% - 32px)) !important;
  max-width: var(--payment-dialog-width-pad);
  border-radius: var(--payment-dialog-radius);
  transform: translate(-50%, -50%);
}

.payment-demo .el-dialog__wrapper.dialog-fade-enter-active:has(.payment-dialog--bottom),
.payment-demo .el-dialog__wrapper.dialog-fade-leave-active:has(.payment-dialog--bottom) {
  animation: none !important;
}

.payment-demo .el-dialog__wrapper.dialog-fade-enter-active:has(.payment-dialog--bottom) .payment-dialog--bottom {
  animation: payment-sheet-in 280ms ease-out;
}

.payment-demo .el-dialog__wrapper.dialog-fade-leave-active:has(.payment-dialog--bottom) .payment-dialog--bottom {
  animation: payment-sheet-out 240ms ease-in;
}

@keyframes payment-sheet-in {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes payment-sheet-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
