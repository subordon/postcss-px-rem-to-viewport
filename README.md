# postcss-px-rem-to-viewport

[English](./README_EN.md) | 中文

一个 PostCSS 插件，用于将 CSS 中的 `px` 和 `rem` 单位转换为视口单位 (`vw`、`vmin` 等)，实现响应式设计的自动化转换。

## 特性

- ✅ 支持 `px` 转换为视口单位
- ✅ 支持 `rem` 转换为视口单位
- ✅ 支持 `vw` 和 `vmin` 单位
- ✅ 可配置的转换精度
- ✅ 可配置的视口宽度和基础字体大小
- ✅ 完整的 TypeScript 支持
- ✅ 零依赖

## 安装

```bash
npm install postcss-px-rem-to-viewport --save-dev
```

或者使用其他包管理器：

```bash
yarn add -D postcss-px-rem-to-viewport
pnpm add -D postcss-px-rem-to-viewport
bun add -d postcss-px-rem-to-viewport
```

## 使用方法

### PostCSS 配置

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-px-rem-to-viewport')({
      designWidth: 375, // 设计稿宽度
      baseFontSize: 16, // 根元素字体大小
      unitPrecision: 5, // 转换精度
      unit: 'vw', // 转换单位
      minPixelValue: 1 // 最小转换值阈值
    })
  ]
}
```

### Webpack 配置

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

### Vite 配置

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

## 配置选项

| 选项            | 类型                                    | 默认值 | 描述                                |
| --------------- | --------------------------------------- | ------ | ----------------------------------- |
| `designWidth`   | `number \| ((input?: Input) => number)` | `375`  | 设计稿宽度 (px)                     |
| `baseFontSize`  | `number`                                | `16`   | 根元素字体大小 (px)，用于 rem 转换  |
| `unitPrecision` | `number`                                | `5`    | 转换结果的小数位精度                |
| `unit`          | `'vw' \| 'vmin'`                        | `'vw'` | 转换目标单位                        |
| `minPixelValue` | `number`                                | `1`    | 最小转换值阈值 (px)，小于此值不转换 |

## 转换示例

### 输入 CSS

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

### 输出 CSS (使用默认配置)

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

## 转换规则

### px 转换

- 公式：`(px值 / 设计稿宽度) * 100 + 单位`
- 示例：`10px` → `(10 / 375) * 100 = 2.66667vw`

### rem 转换

- 公式：`((rem值 * 基础字体大小) / 设计稿宽度) * 100 + 单位`
- 示例：`1rem` → `((1 * 16) / 375) * 100 = 4.26667vw`

## API 文档

### 插件函数

```typescript
function plugin(options?: PluginOptions): PostCSSPlugin
```

### PluginOptions 接口

```typescript
interface PluginOptions {
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
```

## 常见问题

### Q: 为什么选择这个插件？

A: 相比其他同类插件，本插件具有以下优势：

- 同时支持 px 和 rem 转换
- 完整的 TypeScript 支持
- 零运行时依赖
- 完善的测试覆盖

### Q: 如何处理不需要转换的值？

A: 插件会自动跳过以下情况：

- 已经是视口单位的值 (vw, vh, vmin, vmax)
- 百分比、关键字等非数值单位
- 无效的数值

### Q: 支持哪些 PostCSS 版本？

A: 支持 PostCSS 8.x 版本。

## 开发

### 安装依赖

```bash
bun install
```

### 运行测试

```bash
bun run test
```

### 构建项目

```bash
bun run build
```

### 开发模式

```bash
bun run dev
```

## 许可证

MIT © [bordon](https://github.com/subordon)

## 贡献

欢迎提交 Issue 和 Pull Request！
