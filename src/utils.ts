import type { PluginOptions } from './index'

const COMBINED_REGEX = /(-?[\d.]+)(px|rem)/g

const formatNumber = (num: number, precision: number): string => {
  const factor = Math.pow(10, precision)
  const rounded = Math.round(num * factor) / factor
  return rounded.toString()
}

export const transform = (value: string, options: Required<PluginOptions> & { designWidth: number }) => {
  if (!value.includes('px') && !value.includes('rem')) {
    return value
  }

  const viewportRatio = 100 / options.designWidth

  return value.replace(COMBINED_REGEX, (match, numStr, unit) => {
    const num = parseFloat(numStr)
    if (isNaN(num)) return match

    const pxValue = unit === 'px' ? num : num * options.baseFontSize

    if (Math.abs(pxValue) < options.minPixelValue) {
      return match
    }

    const viewportValue = pxValue * viewportRatio
    return `${formatNumber(viewportValue, options.unitPrecision)}${options.unit}`
  })
}
