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
          designWidth: (input) => {
            if (input?.file?.indexOf('vant') !== -1) {
              return 375
            }
            return 750
          },
          baseFontSize: 16,
          unitPrecision: 5,
          unit: 'vw',
          minPixelValue: 1
        })
      ]
    }
  }
})
