# postcss-px-rem-to-viewport

English | [中文](./README.md)

A PostCSS plugin that converts `px` and `rem` units in CSS to viewport units (`vw`, `vmin`, etc.), enabling automated responsive design transformations.

## Features

- ✅ Convert `px` to viewport units
- ✅ Convert `rem` to viewport units
- ✅ Support for `vw` and `vmin` units
- ✅ Configurable conversion precision
- ✅ Configurable viewport width and base font size
- ✅ Full TypeScript support
- ✅ Zero dependencies

## Installation

```bash
npm install postcss-px-rem-to-viewport --save-dev
```

Or using other package managers:

```bash
yarn add -D postcss-px-rem-to-viewport
pnpm add -D postcss-px-rem-to-viewport
bun add -d postcss-px-rem-to-viewport
```

## Usage

### PostCSS Configuration

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-rem-to-viewport')({
      designWidth: 375, // Design draft width
      baseFontSize: 16, // Root element font size
      unitPrecision: 5, // Conversion precision
      unit: 'vw', // Target unit
      minPixelValue: 1 // Minimum pixel value threshold
    })
  ]
}
```

### Webpack Configuration

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-px-rem-to-viewport',
                    {
                      designWidth: 375,
                      baseFontSize: 16,
                      unitPrecision: 5,
                      unit: 'vw',
                      minPixelValue: 1
                    }
                  ]
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

### Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite'
import postcssPxRemToViewport from 'postcss-px-rem-to-viewport'

export default defineConfig({
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
```

## Configuration Options

| Option          | Type             | Default | Description                                                         |
| --------------- | ---------------- | ------- | ------------------------------------------------------------------- |
| `designWidth`   | `number`         | `375`   | Design draft width (px)                                             |
| `baseFontSize`  | `number`         | `16`    | Root element font size (px), used for rem conversion                |
| `unitPrecision` | `number`         | `5`     | Decimal precision of conversion result                              |
| `unit`          | `'vw' \| 'vmin'` | `'vw'`  | Target conversion unit                                              |
| `minPixelValue` | `number`         | `1`     | Minimum pixel value threshold, values below this won't be converted |

## Conversion Examples

### Input CSS

```css
.container {
  width: 375px;
  height: 200px;
  padding: 1rem;
  margin: 10px 2rem;
  font-size: 16px;
}

.box {
  width: calc(100px + 2rem);
  border: 1px solid #ccc;
}
```

### Output CSS (using default configuration)

```css
.container {
  width: 100vw;
  height: 53.33333vw;
  padding: 4.26667vw;
  margin: 2.66667vw 8.53333vw;
  font-size: 4.26667vw;
}

.box {
  width: calc(26.66667vw + 8.53333vw);
  border: 0.26667vw solid #ccc;
}
```

## Conversion Rules

### px Conversion

- Formula: `(px value / design width) * 100 + unit`
- Example: `10px` → `(10 / 375) * 100 = 2.66667vw`

### rem Conversion

- Formula: `((rem value * base font size) / design width) * 100 + unit`
- Example: `1rem` → `((1 * 16) / 375) * 100 = 4.26667vw`

## API Documentation

### Plugin Function

```typescript
function plugin(options?: PluginOptions): PostCSSPlugin
```

### PluginOptions Interface

```typescript
interface PluginOptions {
  /**
   * Design draft width
   * @default 375
   */
  designWidth?: number | (input: string) => number
  /**
   * Conversion precision
   * @default 5
   */
  unitPrecision?: number
  /**
   * Root element font size (1rem = ?px)
   * @default 16
   */
  baseFontSize?: number
  /**
   * Target conversion unit
   * @default vw
   */
  unit?: 'vw' | 'vmin'
  /**
   * Minimum pixel value threshold (px), units below this value won't be converted
   * @default 1
   */
  minPixelValue?: number
}
```

## FAQ

### Q: Why choose this plugin?

A: Compared to other similar plugins, this plugin has the following advantages:

- Supports both px and rem conversion simultaneously
- Full TypeScript support
- Zero runtime dependencies
- Comprehensive test coverage

### Q: How are values that don't need conversion handled?

A: The plugin will automatically skip the following cases:

- Values that are already viewport units (vw, vh, vmin, vmax)
- Percentages, keywords, and other non-numeric units
- Invalid numeric values

### Q: Which PostCSS versions are supported?

A: Supports PostCSS 8.x versions.

## Development

### Install Dependencies

```bash
bun install
```

### Run Tests

```bash
bun run test
```

### Build Project

```bash
bun run build
```

### Development Mode

```bash
bun run dev
```

## License

MIT © [bordon](https://github.com/subordon)

## Contributing

Issues and Pull Requests are welcome!
