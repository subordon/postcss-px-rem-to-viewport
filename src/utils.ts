import type { PluginOptions } from './index'

const PX_REGEX = /(-?[\d.]+)px/g
const REM_REGEX = /(-?[\d.]+)rem/g

const convertPxToViewport = (value: string, { viewportWidth, unitPrecision, unit }: Required<PluginOptions>) => {
  if (viewportWidth <= 0) {
    throw new Error('viewportWidth must be greater than 0')
  }
  return value.replace(PX_REGEX, (_, pxValue) => {
    const num = parseFloat(pxValue)
    if (isNaN(num)) return _
    const viewportValue = (num / viewportWidth) * 100
    return `${Number(viewportValue.toFixed(unitPrecision))}${unit}`
  })
}

const convertRemToViewport = (
  value: string,
  { baseFontSize, viewportWidth, unitPrecision, unit }: Required<PluginOptions>
) => {
  return value.replace(REM_REGEX, (_, remValue) => {
    const num = parseFloat(remValue)
    if (isNaN(num)) return _
    const viewportValue = ((num * baseFontSize) / viewportWidth) * 100
    return `${Number(viewportValue.toFixed(unitPrecision))}${unit}`
  })
}

export const processValue = (value: string, options: Required<PluginOptions>) => {
  if (!value.includes('px') && !value.includes('rem')) {
    return value
  }

  let result = value
  if (value.includes('px')) {
    result = convertPxToViewport(result, options)
  }
  if (result.includes('rem')) {
    result = convertRemToViewport(result, options)
  }
  return result
}
