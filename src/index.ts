import type { Input, Root } from 'postcss'
import { transform } from './utils'

export interface PluginOptions {
  /**
   * 设计稿宽度
   * @default 375
   */
  designWidth?: number | ((input?: Input) => number)
  /**
   * 转换精度
   * @default 5
   */
  unitPrecision?: number
  /**
   * 根元素字体大小 (1rem = ?px)
   * @default 16
   */
  baseFontSize?: number
  /**
   * 转换单位
   * @default vw
   */
  unit?: 'vw' | 'vmin'
  /**
   * 最小转换值阈值 (px)，小于此值的单位不会被转换
   * @default 1
   */
  minPixelValue?: number
}

const plugin = (options: PluginOptions = {}) => {
  const { designWidth = 375, baseFontSize = 16, unitPrecision = 5, unit = 'vw', minPixelValue = 1 } = options

  return {
    postcssPlugin: 'postcss-px-rem-to-viewport',
    Once(css: Root) {
      const input = css.source?.input
      const designWidthValue = typeof designWidth === 'function' ? designWidth(input) : designWidth
      css.walkDecls((decl) => {
        if (decl.value) {
          decl.value = transform(decl.value, {
            designWidth: designWidthValue,
            baseFontSize,
            unitPrecision,
            unit,
            minPixelValue
          })
        }
      })
    }
  }
}

plugin.postcss = true

export default plugin
