<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  buildGoogleBooksCoverUrl,
  normalizeGoogleBooksImageUrl,
  resolveCoverUrl,
} from '../utils/bookCover'

interface Props {
  volumeId: string
  src?: string
  alt: string
  size?: 'thumb' | 'large'
  imgClass?: string
  placeholderClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'thumb',
  imgClass: '',
  placeholderClass: '',
})

const displaySrc = ref('')
const showPlaceholder = ref(false)

function setInitialSrc(): void {
  showPlaceholder.value = false
  displaySrc.value = resolveCoverUrl(props.volumeId, props.src, props.size)
}

watch(
  () => [props.volumeId, props.src, props.size] as const,
  () => setInitialSrc(),
  { immediate: true },
)

function handleError(): void {
  const fallback = buildGoogleBooksCoverUrl(props.volumeId, props.size)

  if (displaySrc.value !== fallback) {
    displaySrc.value = fallback
    return
  }

  const normalized = normalizeGoogleBooksImageUrl(props.src)
  if (normalized && displaySrc.value !== normalized) {
    displaySrc.value = normalized
    return
  }

  showPlaceholder.value = true
  displaySrc.value = ''
}
</script>

<template>
  <img
    v-if="!showPlaceholder"
    :src="displaySrc"
    :alt="alt"
    :class="imgClass"
    referrerpolicy="no-referrer"
    @error="handleError"
  />
  <div v-else :class="placeholderClass">Sin portada</div>
</template>
