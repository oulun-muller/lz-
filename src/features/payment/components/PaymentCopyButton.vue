<script setup lang="ts">
import iconCopy from '../assets/icon-copy.svg'

defineProps<{
  label: string
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <button type="button" class="payment-copy-btn" :aria-label="label" @click.stop="emit('copy')">
    <img :src="iconCopy" alt="" />
  </button>
</template>

<style scoped>
.payment-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--payment-copy-icon);
  height: var(--payment-copy-icon);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.payment-copy-btn img {
  display: block;
  width: var(--payment-copy-icon);
  height: var(--payment-copy-icon);
}
</style>
