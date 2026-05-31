<script lang="ts">
  import type { BookStatus } from '../types/book'
  import { STATUS_LABELS } from '../types/book'

  interface Props {
    status: BookStatus
    readingProgress?: number
    size?: 'sm' | 'md'
  }

  let { status, readingProgress, size = 'sm' }: Props = $props()

  const label = $derived(
    status === 'READING' && readingProgress !== undefined
      ? `${STATUS_LABELS.READING} · ${readingProgress}%`
      : STATUS_LABELS[status],
  )

  const statusClass = $derived(`status-${status.toLowerCase()}`)
</script>

<span class="status-badge {statusClass} size-{size}">
  {label}
</span>

<style>
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
