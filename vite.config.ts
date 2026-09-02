import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

/** GitHub Pages 项目站需带仓库名前缀，例如 /lz-Mobile-payment-popup/ */
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 45217,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 45217,
    strictPort: false,
  },
})
