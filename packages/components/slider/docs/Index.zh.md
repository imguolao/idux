---
category: components
type: 数据录入
title: Slider
subtitle: 滑动输入条
order: 0
---

滑动型输入器，展示当前值和可选范围。

## 何时使用

当用户需要在数值区间/自定义区间内进行选择时，可为连续或离散值。

## API

### IxSlider

#### SliderProps

| 名称 | 说明 | 类型  | 默认值 | 全局配置 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `v-model:value` | 绑定值 | `number` | `0` | - | - |
| `disabled` | 设置禁用状态 | `boolean` | `false` | - | - |
| `dotStop` | 是否只能拖拽到间断点上 | `boolean` | `true` | ✅ | 设置 `step` or `marks` 后生效 |
|`marks`|刻度标记，`key` 的类型必须为 `number` 且取值在闭区间 `[min, max]` 内，每个标签可以单独设置样式|`object`|-|-|`{ number: string \| VNode } or { number: { style: object, label: string \| VNode } } or { number: () => VNode }` |
| `max` | 最大值 | `number` | `100` | ✅ | - |
| `min` | 最小值 | `number` | `0` | ✅ | - |
| `range` | 设置范围选择模式 | `boolean` | `false` | ✅ | 双滑块模式 |
| `reverse` | 设置反向坐标轴 | `boolean` | `false` | ✅ | - |
| `step` | 步长 | `number` | `1` | ✅ | 要大于0 |
| `tooltipFormatter` | 格式化 `tooltip` 内容 | `(value) => VNode \| string \| number` | - | ✅ | - |
| `tooltipPlacement` | 设置 `tooltip` 显示位置 | `string` | `auto` | ✅ | 参考 [Tooltip](/components/tooltip/) |
| `tooltipVisible` | 设置 `tooltip` 显示状态 | `boolean` | - | ✅ | `tooltip` 默认为 `hover` 和拖拽时显示，`tooltipVisible` 设置为 `true` 则始终显示，反之则始终不显示 |
| `vertical` | 设置垂直状态 | `boolean` | `false` | ✅ | - |

#### SliderMethods

| 名称 | 说明 | 参数类型 | 备注 |
| -- | -- | -- | -- |
| `change` | 滑块移动结束后触发 | `(value) => void` | 会传入改变后的值 |
| `input` | 当 slider 的值发生改变时触发（滑块移动中触发） | `(value) => void` | 会传入改变后的值 |

