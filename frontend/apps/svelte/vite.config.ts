import path from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
const frontendRoot = path.resolve(__dirname, '../..')

export default defineConfig({
  envDir: path.resolve(frontendRoot, '..'),
  server: {
    port: 5174,
    fs: {
      // CSS y código compartido viven fuera de apps/svelte
      allow: [frontendRoot],
    },
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      '@mybooks/shared': path.resolve(frontendRoot, 'packages/shared/src'),
    },
  },
})
