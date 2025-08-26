import { describe, expect, test } from 'vitest'
import postcss from 'postcss'
import { type PluginOptions } from '../src'
import plugin from '../src'
import { processValue } from '../src/utils'

const defaultOptions = {
  designWidth: 375,
  baseFontSize: 16,
  unitPrecision: 5,
  unit: 'vw',
  minPixelValue: 0
} satisfies PluginOptions

describe('processValue utility', () => {
  test('px -> vw', () => {
    expect(processValue('160px', defaultOptions)).toBe('42.66667vw')
  })

  test('rem -> vw', () => {
    expect(processValue('10rem', defaultOptions)).toBe('42.66667vw')
  })

  test('edge cases', () => {
    expect(processValue('0px', defaultOptions)).toBe('0vw')
    expect(processValue('-10px', defaultOptions)).toBe('-2.66667vw')
    expect(processValue('1.5px', defaultOptions)).toBe('0.4vw')
    expect(processValue('0.5rem', defaultOptions)).toBe('2.13333vw')
    expect(processValue('-2rem', defaultOptions)).toBe('-8.53333vw')
  })

  test('mixed values', () => {
    expect(processValue('10px 20rem', defaultOptions)).toBe('2.66667vw 85.33333vw')
    expect(processValue('margin: 10px 5rem 20px 2rem', defaultOptions)).toBe(
      'margin: 2.66667vw 21.33333vw 5.33333vw 8.53333vw'
    )
  })

  test('no conversion needed', () => {
    expect(processValue('50vw', defaultOptions)).toBe('50vw')
    expect(processValue('auto', defaultOptions)).toBe('auto')
    expect(processValue('100%', defaultOptions)).toBe('100%')
    expect(processValue('inherit', defaultOptions)).toBe('inherit')
  })

  test('complex values', () => {
    expect(processValue('calc(100px + 2rem)', defaultOptions)).toBe('calc(26.66667vw + 8.53333vw)')
    expect(processValue('rgba(255, 255, 255, 0.5) 10px', defaultOptions)).toBe('rgba(255, 255, 255, 0.5) 2.66667vw')
  })
})

describe('configuration options', () => {
  test('different design width', () => {
    const options = { ...defaultOptions, designWidth: 750 }
    expect(processValue('75px', options)).toBe('10vw')
  })

  test('different base font size', () => {
    const options = { ...defaultOptions, baseFontSize: 20 }
    expect(processValue('1rem', options)).toBe('5.33333vw')
  })

  test('different unit precision', () => {
    const options = { ...defaultOptions, unitPrecision: 2 }
    expect(processValue('160px', options)).toBe('42.67vw')
  })

  test('vmin unit', () => {
    const options = { ...defaultOptions, unit: 'vmin' as const }
    expect(processValue('160px', options)).toBe('42.66667vmin')
  })

  test('minPixelValue threshold for px', () => {
    const options = { ...defaultOptions, minPixelValue: 2 }
    expect(processValue('1px', options)).toBe('1px') // 小于阈值，不转换
    expect(processValue('-1.5px', options)).toBe('-1.5px') // 绝对值小于阈值，不转换
    expect(processValue('2px', options)).toBe('0.53333vw') // 等于阈值，转换
    expect(processValue('3px', options)).toBe('0.8vw') // 大于阈值，转换
  })

  test('minPixelValue threshold for rem', () => {
    const options = { ...defaultOptions, minPixelValue: 10, baseFontSize: 16 }
    expect(processValue('0.5rem', options)).toBe('0.5rem') // 0.5 * 16 = 8px < 10px，不转换
    expect(processValue('0.625rem', options)).toBe('2.66667vw') // 0.625 * 16 = 10px >= 10px，转换
    expect(processValue('1rem', options)).toBe('4.26667vw') // 1 * 16 = 16px > 10px，转换
  })

  test('minPixelValue with mixed values', () => {
    const options = { ...defaultOptions, minPixelValue: 2 }
    expect(processValue('1px 3px 1.5px 4px', options)).toBe('1px 0.8vw 1.5px 1.06667vw')
    expect(processValue('margin: 1px 10px', options)).toBe('margin: 1px 2.66667vw')
  })
})

describe('PostCSS plugin integration', () => {
  test('transforms CSS declarations', async () => {
    const css = '.test { width: 100px; height: 2rem; margin: 10px 5rem; }'
    const result = await postcss([plugin(defaultOptions)]).process(css, { from: undefined })

    expect(result.css).toBe('.test { width: 26.66667vw; height: 8.53333vw; margin: 2.66667vw 21.33333vw; }')
  })

  test('handles multiple selectors', async () => {
    const css = '.a { font-size: 16px; } .b { padding: 1rem; }'
    const result = await postcss([plugin(defaultOptions)]).process(css, { from: undefined })

    expect(result.css).toBe('.a { font-size: 4.26667vw; } .b { padding: 4.26667vw; }')
  })

  test('preserves non-convertible values', async () => {
    const css = '.test { color: red; display: flex; width: 100%; height: 50vh; }'
    const result = await postcss([plugin(defaultOptions)]).process(css, { from: undefined })

    expect(result.css).toBe('.test { color: red; display: flex; width: 100%; height: 50vh; }')
  })

  test('works with default options', async () => {
    const css = '.test { width: 100px; }'
    const result = await postcss([plugin()]).process(css, { from: undefined })

    expect(result.css).toBe('.test { width: 26.66667vw; }')
  })

  test('works with minPixelValue option', async () => {
    const css = '.test { width: 1px; height: 5px; margin: 2px; }'
    const result = await postcss([plugin({ minPixelValue: 3 })]).process(css, { from: undefined })

    expect(result.css).toBe('.test { width: 1px; height: 1.33333vw; margin: 2px; }')
  })
})

describe('performance optimizations', () => {
  test('combined regex handles mixed units correctly', () => {
    expect(processValue('10px 2rem 15px 1.5rem', defaultOptions)).toBe('2.66667vw 8.53333vw 4vw 6.4vw')
    expect(processValue('border: 1px solid; padding: 10px 2rem', defaultOptions)).toBe('border: 0.26667vw solid; padding: 2.66667vw 8.53333vw')
  })

  test('performance with large values', () => {
    const largeValue = '10px 20px 30px 40px 50px 1rem 2rem 3rem 4rem 5rem'.repeat(10)
    const result = processValue(largeValue, defaultOptions)
    
    // 验证结果包含正确转换的值
    expect(result).toContain('2.66667vw') // 10px
    expect(result).toContain('4.26667vw') // 1rem
    expect(result).not.toContain('px')
    expect(result).not.toContain('rem')
  })

  test('single regex processes all units in one pass', () => {
    const mixedValue = 'margin: 10px 2rem; padding: 5px 1rem; border: 1px solid'
    const result = processValue(mixedValue, defaultOptions)
    
    expect(result).toBe('margin: 2.66667vw 8.53333vw; padding: 1.33333vw 4.26667vw; border: 0.26667vw solid')
  })
})
