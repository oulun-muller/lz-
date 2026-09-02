<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { paymentCopy } from '../data/copy'
import type {
  ActivationStep,
  PaymentMethod,
  PaymentOrder,
  PaymentPlacement,
  PaymentStep,
} from '../data/types'
import qrCodeImage from '../assets/mock-qrcode.png'
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
const showFooterSpacer = computed(() =>
  ['qrcode', 'loading', 'allocating'].includes(props.step),
)

const activationScrollRef = ref<HTMLElement | null>(null)
const activationTrackRef = ref<HTMLElement | null>(null)
const activationThumbHeight = ref(80)
const activationThumbOffset = ref(0)

let boundActivationScroller: HTMLElement | null = null
let activationResizeObserver: ResizeObserver | null = null

function syncActivationThumb() {
  const scroller = boundActivationScroller || activationScrollRef.value
  const track = activationTrackRef.value
  if (!scroller || !track) return

  const { scrollTop, scrollHeight, clientHeight } = scroller
  const styles = window.getComputedStyle(track)
  const padTop = Number.parseFloat(styles.paddingTop) || 0
  const padBottom = Number.parseFloat(styles.paddingBottom) || 0
  const trackInner = Math.max(track.clientHeight - padTop - padBottom, 1)
  const proportional = (clientHeight / Math.max(scrollHeight, 1)) * trackInner
  const thumbHeight = Math.min(80, Math.max(32, proportional))
  const maxOffset = Math.max(trackInner - thumbHeight, 0)
  const maxScroll = Math.max(scrollHeight - clientHeight, 0)
  const offset = maxScroll === 0 ? 0 : (scrollTop / maxScroll) * maxOffset

  activationThumbHeight.value = thumbHeight
  activationThumbOffset.value = offset
}

function unbindActivationScroll() {
  boundActivationScroller?.removeEventListener('scroll', syncActivationThumb)
  boundActivationScroller = null
  activationResizeObserver?.disconnect()
  activationResizeObserver = null
}

function bindActivationScroll() {
  unbindActivationScroll()
  const scroller = activationScrollRef.value
  if (!scroller) return
  boundActivationScroller = scroller
  scroller.addEventListener('scroll', syncActivationThumb, { passive: true })
  activationResizeObserver = new ResizeObserver(() => syncActivationThumb())
  activationResizeObserver.observe(scroller)
  syncActivationThumb()
}

const activationSteps = ref<ActivationStep[]>([])

async function ensureActivationSteps() {
  if (activationSteps.value.length) return
  const mod = await import('../data/activation')
  activationSteps.value = mod.activationSteps
}

watch(
  () => [props.visible, props.step] as const,
  async ([visible, step]) => {
    if (visible && (step === 'activation' || step === 'success')) {
      await ensureActivationSteps()
    }
    await nextTick()
    if (visible && step === 'activation') {
      bindActivationScroll()
    } else {
      unbindActivationScroll()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unbindActivationScroll()
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
  emit('close')
}
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
            <img
              class="payment-dialog__qr"
              :src="qrCodeImage"
              width="140"
              height="140"
              alt=""
            />
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
            <span class="payment-dialog__code-group">
              <span class="payment-dialog__code-value">{{ order.activationCode }}</span>
              <button
                type="button"
                class="payment-dialog__copy-btn"
                :aria-label="paymentCopy.copyCode"
                @click="emit('copy-text', order.activationCode)"
              >
                <img :src="iconCopy" alt="" />
              </button>
            </span>
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
              <span
                class="payment-dialog__detail-value"
                :class="{ 'is-copyable': row.copyable }"
              >
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
              </span>
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
        <div
          ref="activationScrollRef"
          class="payment-dialog__activation-scroll"
          @scroll="syncActivationThumb"
        >
          <div class="payment-dialog__activation-code">
            <span class="payment-dialog__activation-label">{{ paymentCopy.activationCodeLabel }}</span>
            <span class="payment-dialog__code-group">
              <span class="payment-dialog__activation-value">{{ order.activationCode }}</span>
              <button
                type="button"
                class="payment-dialog__copy-btn"
                :aria-label="paymentCopy.copyCode"
                @click="emit('copy-text', order.activationCode)"
              >
                <img :src="iconCopy" alt="" />
              </button>
            </span>
          </div>
          <div class="payment-dialog__divider" />
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
    <div v-else-if="showFooterSpacer" class="payment-dialog__footer payment-dialog__footer--spacer" />
    <div
      v-if="step === 'activation'"
      ref="activationTrackRef"
      class="payment-dialog__scrollbar"
      aria-hidden="true"
    >
      <div
        class="payment-dialog__scrollbar-thumb"
        :style="{
          height: `${activationThumbHeight}px`,
          transform: `translateY(${activationThumbOffset}px)`,
        }"
      />
    </div>
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

.payment-dialog__amount-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  padding-bottom: var(--space-16);
  text-align: center;
}

.payment-dialog__amount-label {
  margin: 0;
  color: var(--color-payment-label);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: var(--payment-label-line);
}

.payment-dialog__amount {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: var(--payment-amount-line);
  margin: 0;
  color: var(--color-payment-amount);
  line-height: 1;
}

.payment-dialog__amount-symbol {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-medium);
}

.payment-dialog__amount-value {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-medium);
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

.payment-dialog__detail-value {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  min-width: 0;
}

.payment-dialog__detail-value.is-copyable {
  gap: var(--space-8);
}

.payment-dialog__detail-value > span {
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
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: var(--payment-qr-frame);
  height: var(--payment-qr-frame);
  padding: calc((var(--payment-qr-frame) - var(--payment-qr-size) - var(--payment-qr-border) * 2) / 2);
  border: var(--payment-qr-border) solid var(--color-border-subtle);
}

.payment-dialog__qr {
  display: block;
  width: var(--payment-qr-size);
  height: var(--payment-qr-size);
  object-fit: cover;
}

.payment-dialog__qr-hint {
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
  gap: var(--space-4);
  align-items: center;
  justify-content: center;
}

.payment-dialog__code-group {
  display: flex;
  gap: var(--space-8);
  align-items: center;
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
  flex-shrink: 0;
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
  width: 100%;
  height: 0.5px;
  background: var(--color-border-subtle);
}

.payment-dialog__activation-scroll {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-24);
  align-items: center;
  min-height: 0;
  padding: var(--space-16);
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.payment-dialog__activation-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.payment-dialog__scrollbar {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--payment-scrollbar-gutter);
  padding: var(--payment-scrollbar-pad-top) var(--space-4) var(--payment-scrollbar-pad-bottom);
  overflow: hidden;
  pointer-events: none;
}

.payment-dialog__scrollbar-thumb {
  flex-shrink: 0;
  width: var(--payment-scrollbar-thumb);
  border-radius: 2px;
  background: var(--color-payment-scrollbar);
  will-change: transform;
}

.payment-dialog__activation-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
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
  font-weight: var(--font-weight-medium);
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
  background: rgba(0, 0, 0, 0.6) !important;
}

.payment-layer .el-dialog__wrapper {
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
  width: min(var(--payment-dialog-width-pad), calc(100% - 32px)) !important;
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
