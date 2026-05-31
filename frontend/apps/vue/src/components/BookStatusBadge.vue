<script setup lang="ts">
import { computed } from 'vue'
import type { BookStatus } from '@mybooks/shared'
import { STATUS_LABELS } from '@mybooks/shared'

interface Props {
  status: BookStatus
  readingProgress?: number
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
})

const label = computed(() => {
  if (props.status === 'READING' && props.readingProgress !== undefined) {
    return `${STATUS_LABELS.READING} · ${props.readingProgress}%`
  }
  return STATUS_LABELS[props.status]
})
</script>

<template>
  <span
    class="status-badge"
    :class="[`status-${status.toLowerCase()}`, `size-${size}`]"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

.size-sm {
  padding: 0.2rem 0.55rem;
  font-size: 0.75rem;
}

.size-md {
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
}

.status-want_to_read {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.status-reading {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.status-read {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
</style>
