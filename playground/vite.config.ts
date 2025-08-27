import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import postcssPxRemToViewport from '../src/index'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  css: {
    postcss: {
      plugins: [
        postcssPxRemToViewport({
          designWidth: 375,
          baseFontSize: 16,
          unitPrecision: 5,
          unit: 'vw',
          minPixelValue: 1
        })
      ]
    }
  }
})
