import path from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, '../../..'),
  server: {
    port: 5174,
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      '@mybooks/shared': path.resolve(
        __dirname,
        '../../packages/shared/src',
      ),
    },
  },
})
