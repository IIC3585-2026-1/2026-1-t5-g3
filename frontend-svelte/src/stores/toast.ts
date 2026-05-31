import { writable } from 'svelte/store'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

export const toast = writable<Toast | null>(null)

let nextId = 0
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function showToast(message: string, type: ToastType = 'success'): void {
  clearTimeout(hideTimer)
  toast.set({ id: ++nextId, message, type })
  hideTimer = setTimeout(() => {
    toast.set(null)
  }, 3000)
}

export function hideToast(): void {
  clearTimeout(hideTimer)
  toast.set(null)
}
