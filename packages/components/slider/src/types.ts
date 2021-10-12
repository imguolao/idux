import type { DefineComponent, HTMLAttributes, VNode, ComputedRef, Ref } from 'vue'
import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'

import { IxPropTypes } from '@idux/cdk/utils'

export const sliderStartDirection = {
  ltr: 'left',
  rtl: 'right',
  btt: 'bottom',
  ttb: 'top',
} as const

export const sliderThumbProps = {
  baseStyle: IxPropTypes.object<Record<string, unknown>>(),
  dragging: IxPropTypes.bool,
  disabled: IxPropTypes.bool,
  tooltipFormatter: IxPropTypes.func<(value: number | number[]) => VNode | string | number>(),
  tooltipVisible: IxPropTypes.bool,
  value: IxPropTypes.number.def(0),

  // events
  // 'onUpdate:value': IxPropTypes.emit<(value: number) => void>(),
  onDragStart: IxPropTypes.emit<(ev: MouseEvent | TouchEvent) => void>(),
  onMouseEnter: IxPropTypes.emit<() => void>(),
  onMouseLeave: IxPropTypes.emit<() => void>(),
}

export const sliderProps = {
  disabled: IxPropTypes.bool.def(false),
  max: IxPropTypes.number.def(100),
  min: IxPropTypes.number.def(0),
  range: IxPropTypes.bool.def(false),
  reverse: IxPropTypes.bool.def(false),
  step: IxPropTypes.number.def(1),
  tooltipFormatter: IxPropTypes.func<(value: number | number[]) => VNode | string | number>(),
  tooltipVisible: IxPropTypes.bool,
  value: IxPropTypes.oneOfType([IxPropTypes.number, IxPropTypes.arrayOf(IxPropTypes.number)]).def(0),
  vertical: IxPropTypes.bool.def(false),

  // events
  'onUpdate:value': IxPropTypes.emit<(value: number | number[]) => void>(),
  onChange: IxPropTypes.emit<(value: number | number[]) => void>(),
  onInput: IxPropTypes.emit<(value: number | number[]) => void>(),
}

type ValueOf<T> = T[keyof T]

export type SliderThumbProps = IxInnerPropTypes<typeof sliderThumbProps>

export type SliderProps = IxInnerPropTypes<typeof sliderProps>
export type SliderPublicProps = IxPublicPropTypes<typeof sliderProps>
export type SliderComponent = DefineComponent<HTMLAttributes & typeof sliderProps>
export type SliderInstance = InstanceType<DefineComponent<SliderProps>>

export interface SliderProvider {
  direction: ComputedRef<ValueOf<typeof sliderStartDirection>>
  max: Ref<number>
  min: Ref<number>
  isDisabled: ComputedRef<boolean>
  precision: Ref<number>
  step: Ref<number>
  vertical: Ref<boolean>
  getRailSize: () => number
}
