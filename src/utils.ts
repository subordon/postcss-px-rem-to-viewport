const COMBINED_REGEX = /(-?[\d.]+)(px|rem)/g

// 常见精度值的查找表,避免重复计算 Math.pow
const PRECISION_FACTORS: Record<number, number> = {
  0: 1,
  1: 10,
  2: 100,
  3: 1000,
  4: 10000,
  5: 100000,
  6: 1000000
}

const formatNumber = (num: number, precision: number): string => {
  const factor = PRECISION_FACTORS[precision] ?? Math.pow(10, precision)
  const rounded = Math.round(num * factor) / factor
  return rounded.toString()
}

export interface TransformBaseOptions {
  /**
   * 转换精度
   * @default 5
   */
  unitPrecision: number
  /**
   * 根元素字体大小 (1rem = ?px)
   * @default 16
   */
  baseFontSize: number
  /**
   * 转换单位
   * @default vw
   */
  unit: 'vw' | 'vmin'
  /**
   * 最小转换值阈值 (px)，小于此值的单位不会被转换
   * @default 1
   */
  minPixelValue: number
}

export interface TransformOptions extends TransformBaseOptions {
  /**
   * 视口比例 (100 / designWidth)
   */
  viewportRatio: number
}

export const transform = (value: string, options: TransformOptions) => {
  return value.replace(COMBINED_REGEX, (match, numStr, unit) => {
    const num = parseFloat(numStr)
    if (isNaN(num)) return match

    const pxValue = unit === 'px' ? num : num * options.baseFontSize

    if (Math.abs(pxValue) < options.minPixelValue) {
      return match
    }

    const viewportValue = pxValue * options.viewportRatio
    return `${formatNumber(viewportValue, options.unitPrecision)}${options.unit}`
  })
}
