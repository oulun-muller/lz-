<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  getBreakpointLabel,
  getDeviceType,
  getPaymentPlacement,
  PAYMENT_CENTER_MIN_WIDTH,
} from '@/shared/utils/viewport'
import { paymentCopy, paymentStepLabels } from '@/features/payment/data/copy'
import type {
  PaymentDebugState,
  PaymentOutcome,
  PaymentStep,
} from '@/features/payment/data/types'

const props = defineProps<{
  viewportWidth: number
  viewportHeight: number
  previewWidth: number
  paymentStep: PaymentStep | null
  paymentDebug: PaymentDebugState
  paymentSteps: Array<PaymentStep | null>
  previewWidths: readonly number[]
}>()

const emit = defineEmits<{
  'update:preview-width': [value: number]
  'open-payment': []
  'update:payment-force-step': [value: PaymentStep | null]
  'update:wallet-installed': [value: boolean]
  'update:payment-outcome': [value: PaymentOutcome]
}>()

const open = ref(false)
const device = computed(() => getDeviceType(props.viewportWidth))
const breakpoint = computed(() => getBreakpointLabel(props.viewportWidth))
const placement = computed(() => getPaymentPlacement(props.viewportWidth))
const outcomes: PaymentOutcome[] = ['success', 'failure']
</script>

<template>
  <aside class="debug" :class="{ 'is-open': open }">
    <el-button class="debug__toggle" size="small" @click="open = !open">
      {{ open ? '收起 Debug' : 'Debug' }}
    </el-button>
    <div v-if="open" class="debug__body">
      <p>
        视口
        <el-tag size="small">{{ viewportWidth }} × {{ viewportHeight }}</el-tag>
      </p>
      <p>
        设备
        <el-tag size="small" type="info">{{ device }}</el-tag>
      </p>
      <p>
        断点
        <el-tag size="small">{{ breakpoint }}</el-tag>
      </p>
      <p>
        弹窗布局
        <el-tag size="small" type="warning">
          {{ placement === 'bottom' ? 'bottom 底部' : 'center 居中' }}
        </el-tag>
      </p>
      <p>形态节点: &lt; {{ PAYMENT_CENTER_MIN_WIDTH }}px 底部，≥ {{ PAYMENT_CENTER_MIN_WIDTH }}px 居中</p>

      <h4>预览宽度</h4>
      <div class="debug__chips">
        <el-button
          v-for="width in previewWidths"
          :key="width"
          size="small"
          :type="previewWidth === width ? 'primary' : 'default'"
          @click="emit('update:preview-width', width)"
        >
          {{ width }}
        </el-button>
        <el-button
          size="small"
          :type="previewWidth === 0 ? 'primary' : 'default'"
          @click="emit('update:preview-width', 0)"
        >
          铺满
        </el-button>
      </div>

      <h4>{{ paymentCopy.debugTitle }}</h4>
      <p>
        {{ paymentCopy.debugStep }}
        <el-tag size="small" type="success">{{ paymentStep || '—' }}</el-tag>
      </p>
      <el-button size="small" type="primary" @click="emit('open-payment')">
        {{ paymentCopy.debugOpen }}
      </el-button>
      <div class="debug__chips">
        <el-button
          v-for="step in paymentSteps"
          :key="String(step)"
          size="small"
          :type="paymentDebug.forceStep === step ? 'primary' : 'default'"
          @click="emit('update:payment-force-step', step)"
        >
          {{ step ? paymentStepLabels[step] : 'Flow' }}
        </el-button>
      </div>
      <p>{{ paymentCopy.debugWallet }}</p>
      <el-switch
        :value="paymentDebug.walletInstalled"
        active-text="已安装"
        inactive-text="未安装"
        @input="emit('update:wallet-installed', $event)"
      />
      <p>{{ paymentCopy.debugOutcome }}</p>
      <el-radio-group
        :value="paymentDebug.outcome"
        size="small"
        @input="emit('update:payment-outcome', $event)"
      >
        <el-radio-button v-for="outcome in outcomes" :key="outcome" :label="outcome">
          {{ outcome }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </aside>
</template>

<style scoped>
.debug {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: var(--z-debug);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: min(360px, calc(100vw - 24px));
  pointer-events: auto;
}

.debug__body {
  margin-top: var(--space-8);
  padding: var(--space-16);
  overflow: auto;
  max-height: min(70vh, 560px);
  background: var(--color-surface-elevated);
  border: var(--border-width-1) solid var(--color-border-subtle);
  border-radius: var(--radius-12);
  box-shadow: var(--shadow-debug);
}

.debug__body p,
.debug__body h4 {
  margin: 0 0 var(--space-8);
  font-size: var(--font-size-12);
  color: var(--color-text-secondary);
}

.debug__body h4 {
  margin-top: var(--space-12);
  color: var(--color-text-primary);
}

.debug__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.debug ::v-deep .el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
</style>
