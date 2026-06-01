import { pop, push } from 'svelte-spa-router'

export function goBack(): void {
  if (window.history.length > 1) {
    pop()
    return
  }
  push('/')
}
