## API

### IxSpin

#### SpinProps

| 参数 | 说明 |  类型  | 默认值 | 全局配置 | 备注 |
| --- | --- | --- | --- | --- | --- |
|`strokeWidth` | 默认loading的strokeWidth |  `number`  | `4` | ✅ | 仅当使用默认loading时生效 |
|`radius` | 默认loading的radius |  `number`  | `14` | ✅ | 仅当使用默认loading时生效 |
|`duration` | 动画时长 |  `number`  | `2` | - | 仅当使用默认loading或 提供 `icon` 配置时生效 |
|`size` | 控制 icon 和 tip大小 |  `sm \| md \| lg`  | `sm` | ✅ | - |
|`spinning` | 是否显示加载遮罩层 |`boolean`| `true` | - | - |
|`ratate` | 是否显示旋转动画 |`boolean`| `true` | - | 仅当 `icon` 不空且没有 `icon` 插槽时生效 |
| `icon`| 加载图标名称 | `string` | -| ✅ | - |
| `tip`| 加载提示文字描述 |  `string`  | `''`| ✅ | - |
| `tipAlign`| 文字描述与加载图标的排列方式 | `vertical \| horizontal` | `vertical`| ✅ | vertical：文字排列在图标下方；horizontal： 文字排列在图标同水平方向的后方 |

#### SpinSlots

|名称 | 说明 | 参数类型 | 备注 |
| --- | --- | --- | --- |
|`default` | 需要遮罩的内容区域 | - | - |

### IxSpinProvider

#### IxSpinProviderMethods

| 名称 | 说明 | 参数类型 | 备注 |
| --- | --- | --- | --- |
| `open`   | 打开 | `(options: SpinOptions) => SpinRef` | `target`不传，默认为`target`为`body` |
| `update`  | 更新 | `(options: SpinOptions) => void` | `target`不传，默认为`target`为`body` |
| `destroy`  | 销毁 | `(target?: TargetType \| TargetType[]) => void` | `target`不传，默认为`target`为`body` |
| `destroyAll`  | 销毁全部 | `() => void` | - |

``` ts
export type SpinOptions = Partial<
  Omit<SpinProps, 'spinning'> & {
    tip: string
    target: string | HTMLElement | (() => string | HTMLElement)
    zIndex: number
  }
>

export type SpinRefUpdateOptions = Omit<SpinOptions, 'target'>

export interface SpinRef {
  update: (options: SpinRefUpdateOptions) => void
  destroy: () => void
}

```
