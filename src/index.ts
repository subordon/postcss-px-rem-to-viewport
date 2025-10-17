import type { Input, Root } from 'postcss'
import { transform, type TransformBaseOptions, type TransformOptions } from './utils'

/**
 * 插件配置选项
 */
export interface PluginOptions extends Partial<TransformBaseOptions> {
  /**
   * 设计稿宽度
   * @default 375
   */
  designWidth?: number | ((input?: Input) => number)
}

const plugin = (options: PluginOptions = {}) => {
  const { designWidth = 375, baseFontSize = 16, unitPrecision = 5, unit = 'vw', minPixelValue = 1 } = options

  return {
    postcssPlugin: 'postcss-px-rem-to-viewport',
    Once(css: Root) {
      const input = css.source?.input
      const designWidthValue = typeof designWidth === 'function' ? designWidth(input) : designWidth

      // 预计算 viewportRatio 和创建一次配置对象,避免重复计算和对象创建
      const viewportRatio = 100 / designWidthValue
      const transformOptions: TransformOptions = {
        viewportRatio,
        baseFontSize,
        unitPrecision,
        unit,
        minPixelValue
      }

      css.walkDecls((decl) => {
        // 提前过滤:避免处理不包含 px 或 rem 的声明
        if (!decl.value || (!decl.value.includes('px') && !decl.value.includes('rem'))) {
          return
        }

        decl.value = transform(decl.value, transformOptions)
      })
    }
  }
}

plugin.postcss = true

export default plugin
export type { TransformBaseOptions, TransformOptions } from './utils'
