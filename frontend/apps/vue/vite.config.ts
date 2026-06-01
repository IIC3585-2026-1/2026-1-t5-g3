import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
const frontendRoot = path.resolve(__dirname, '../..')

export default defineConfig({
  envDir: path.resolve(frontendRoot, '..'),
  plugins: [vue(), vueDevTools()],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [frontendRoot],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@mybooks/shared': path.resolve(frontendRoot, 'packages/shared/src'),
    },
  },
})
