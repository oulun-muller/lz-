<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { paymentCopy } from '../data/copy'
import type { ActivationStep } from '../data/types'
import PaymentCopyButton from './PaymentCopyButton.vue'

const props = defineProps<{
  activationCode: string
  steps: ActivationStep[]
  active: boolean
}>()

const emit = defineEmits<{
  'copy-text': [text: string]
}>()

const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const thumbHeight = ref(80)
const thumbOffset = ref(0)

let boundScroller: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null

function syncThumb() {
  const scroller = boundScroller || scrollRef.value
  const track = trackRef.value
  if (!scroller || !track) return

  const { scrollTop, scrollHeight, clientHeight } = scroller
  const styles = window.getComputedStyle(track)
  const padTop = Number.parseFloat(styles.paddingTop) || 0
  const padBottom = Number.parseFloat(styles.paddingBottom) || 0
  const trackInner = Math.max(track.clientHeight - padTop - padBottom, 1)
  const proportional = (clientHeight / Math.max(scrollHeight, 1)) * trackInner
  const nextHeight = Math.min(80, Math.max(32, proportional))
  const maxOffset = Math.max(trackInner - nextHeight, 0)
  const maxScroll = Math.max(scrollHeight - clientHeight, 0)
  const offset = maxScroll === 0 ? 0 : (scrollTop / maxScroll) * maxOffset

  thumbHeight.value = nextHeight
  thumbOffset.value = offset
}

function unbind() {
  boundScroller?.removeEventListener('scroll', syncThumb)
  boundScroller = null
  resizeObserver?.disconnect()
  resizeObserver = null
}

function bind() {
  unbind()
  const scroller = scrollRef.value
  if (!scroller) return
  boundScroller = scroller
  scroller.addEventListener('scroll', syncThumb, { passive: true })
  resizeObserver = new ResizeObserver(() => syncThumb())
  resizeObserver.observe(scroller)
  syncThumb()
}

watch(
  () => [props.active, props.steps.length] as const,
  async ([active]) => {
    await nextTick()
    if (active) bind()
    else unbind()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unbind()
})
</script>

<template>
  <div class="payment-activation">
    <div ref="scrollRef" class="payment-activation__scroll" @scroll="syncThumb">
      <div class="payment-activation__code">
        <span class="payment-activation__label">{{ paymentCopy.activationCodeLabel }}</span>
        <span class="payment-activation__group">
          <span class="payment-activation__value">{{ activationCode }}</span>
          <PaymentCopyButton
            :label="paymentCopy.copyCode"
            @copy="emit('copy-text', activationCode)"
          />
        </span>
      </div>
      <div class="payment-activation__divider" />
      <article
        v-for="(item, index) in steps"
        :key="`${item.heading}-${index}`"
        class="payment-activation__step"
      >
        <p class="payment-activation__heading">{{ item.heading }}</p>
        <p class="payment-activation__body">{{ item.body }}</p>
        <img class="payment-activation__image" :src="item.image" :alt="item.heading" />
      </article>
    </div>
    <div ref="trackRef" class="payment-activation__scrollbar" aria-hidden="true">
      <div
        class="payment-activation__thumb"
        :style="{
          height: `${thumbHeight}px`,
          transform: `translateY(${thumbOffset}px)`,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.payment-activation {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.payment-activation__scroll {
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

.payment-activation__scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.payment-activation__code {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-4);
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-16);
}

.payment-activation__group {
  display: flex;
  gap: var(--space-8);
  align-items: center;
}

.payment-activation__label {
  color: var(--color-payment-code-label);
  font-size: var(--font-size-14);
}

.payment-activation__value {
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
}

.payment-activation__divider {
  flex-shrink: 0;
  width: 100%;
  height: var(--border-width-hairline);
  background: var(--color-border-subtle);
}

.payment-activation__step {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
  text-align: center;
}

.payment-activation__heading {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-bold);
  line-height: var(--payment-activation-line);
}

.payment-activation__body {
  margin: 0;
  color: var(--color-payment-amount);
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  line-height: var(--payment-activation-line);
}

.payment-activation__image {
  display: block;
  width: 100%;
}

.payment-activation__scrollbar {
  position: absolute;
  top: 0;
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

.payment-activation__thumb {
  flex-shrink: 0;
  width: var(--payment-scrollbar-thumb);
  border-radius: var(--radius-4);
  background: var(--color-payment-scrollbar);
  will-change: transform;
}
</style>
