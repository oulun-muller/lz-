<script setup lang="ts">
import { computed, ref } from 'vue'
import { getBreakpointLabel, getDeviceType, PREVIEW_WIDTHS } from '@/shared/utils/viewport'
import { debugCopy } from '@/shared/ui/debugCopy'
import { mockStatusLabels, paymentCopy, paymentStepLabels } from '@/features/payment/data/copy'
import { PAYMENT_CENTER_MIN_WIDTH, getPaymentPlacement } from '@/features/payment/state/placement'
import type {
  MockStatus,
  PaymentDebugState,
  PaymentOutcome,
  PaymentStep,
} from '@/features/payment/data/types'

const props = defineProps<{
  viewportWidth: number
  viewportHeight: number
  previewWidth: number
  mockStatus: MockStatus
  paymentStep: PaymentStep | null
  paymentDebug: PaymentDebugState
  paymentSteps: Array<PaymentStep | null>
  resourcesReady: boolean
}>()

const emit = defineEmits<{
  'update:preview-width': [value: number]
  'update:mock-status': [value: MockStatus]
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
const statuses: MockStatus[] = [
  'normal',
  'empty',
  'loading',
  'error',
  'longText',
  'longList',
  'boundary',
  'abnormal',
]
</script>

<template>
  <aside class="debug" :class="{ 'is-open': open }">
    <el-button class="debug__toggle" size="small" @click="open = !open">
      {{ open ? debugCopy.close : debugCopy.open }}
    </el-button>
    <div v-if="open" class="debug__body">
      <p>
        {{ debugCopy.viewport }}
        <el-tag size="small">{{ viewportWidth }} × {{ viewportHeight }}</el-tag>
      </p>
      <p>
        {{ debugCopy.device }}
        <el-tag size="small" type="info">{{ device }}</el-tag>
      </p>
      <p>
        {{ debugCopy.breakpoint }}
        <el-tag size="small">{{ breakpoint }}</el-tag>
      </p>
      <p>
        {{ paymentCopy.debugPlacement }}
        <el-tag size="small" type="warning">
          {{
            placement === 'bottom'
              ? paymentCopy.debugPlacementBottom
              : paymentCopy.debugPlacementCenter
          }}
        </el-tag>
      </p>
      <p>
        {{ paymentCopy.debugPlacementRule }}:
        &lt; {{ PAYMENT_CENTER_MIN_WIDTH }}px 底部，≥ {{ PAYMENT_CENTER_MIN_WIDTH }}px 居中
      </p>
      <p>
        {{ debugCopy.library }}
        <el-tag size="small" type="success">{{ debugCopy.libraryValue }}</el-tag>
      </p>
      <p>
        {{ debugCopy.resources }}
        <el-tag size="small" :type="resourcesReady ? 'success' : 'info'">
          {{ resourcesReady ? debugCopy.resourcesReady : debugCopy.resourcesPending }}
        </el-tag>
      </p>

      <h4>{{ debugCopy.mock }}</h4>
      <p>{{ debugCopy.mockHint }}</p>
      <div class="debug__chips">
        <el-button
          v-for="status in statuses"
          :key="status"
          size="small"
          :type="mockStatus === status ? 'primary' : 'default'"
          @click="emit('update:mock-status', status)"
        >
          {{ mockStatusLabels[status] }}
        </el-button>
      </div>

      <h4>{{ debugCopy.previewWidth }}</h4>
      <div class="debug__chips">
        <el-button
          v-for="width in PREVIEW_WIDTHS"
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
          {{ debugCopy.previewFill }}
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
          {{ step ? paymentStepLabels[step] : paymentCopy.debugFlow }}
        </el-button>
      </div>
      <p>{{ paymentCopy.debugWallet }}</p>
      <el-switch
        :value="paymentDebug.walletInstalled"
        :active-text="paymentCopy.debugWalletOn"
        :inactive-text="paymentCopy.debugWalletOff"
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
  left: var(--space-16);
  bottom: calc(var(--space-16) + var(--safe-bottom));
  z-index: var(--z-debug);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: min(360px, calc(100vw - var(--space-24)));
  pointer-events: auto;
}

.debug__body {
  margin-top: var(--space-8);
  padding: var(--space-16);
  overflow: auto;
  max-height: min(78vh, 640px);
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
