<script lang="ts">
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

  let {
    volumeId,
    src,
    alt,
    size = 'thumb',
    imgClass = '',
    placeholderClass = '',
  }: Props = $props()

  let displaySrc = $state('')
  let showPlaceholder = $state(false)

  function setInitialSrc(): void {
    showPlaceholder = false
    displaySrc = resolveCoverUrl(volumeId, src, size)
  }

  $effect(() => {
    setInitialSrc()
  })

  function handleError(): void {
    const fallback = buildGoogleBooksCoverUrl(volumeId, size)

    if (displaySrc !== fallback) {
      displaySrc = fallback
      return
    }

    const normalized = normalizeGoogleBooksImageUrl(src)
    if (normalized && displaySrc !== normalized) {
      displaySrc = normalized
      return
    }

    showPlaceholder = true
    displaySrc = ''
  }
</script>

{#if !showPlaceholder}
  <img
    src={displaySrc}
    {alt}
    class={imgClass}
    referrerpolicy="no-referrer"
    onerror={handleError}
  />
{:else}
  <div class={placeholderClass}>Sin portada</div>
{/if}
