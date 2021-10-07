import type { DefineComponent, HTMLAttributes, VNode } from 'vue'
import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'

import { IxPropTypes } from '@idux/cdk/utils'

export const sliderThumbProps = {
  tabIndex: IxPropTypes.number.def(0),
  tooltipFormatter: IxPropTypes.func<(value: number | number[]) => VNode | string | number>(),
  value: IxPropTypes.number.def(0),
}

export const sliderProps = {
  disabled: IxPropTypes.bool,
  max: IxPropTypes.number.def(100),
  min: IxPropTypes.number.def(0),
  range: IxPropTypes.bool,
  tooltipFormatter: IxPropTypes.func<(value: number | number[]) => VNode | string | number>(),
  value: IxPropTypes.oneOfType([IxPropTypes.number, IxPropTypes.arrayOf(IxPropTypes.number)]).def(0),
}

export type SliderThumbProps = IxInnerPropTypes<typeof sliderThumbProps>

export type SliderProps = IxInnerPropTypes<typeof sliderProps>
export type SliderPublicProps = IxPublicPropTypes<typeof sliderProps>
export type SliderComponent = DefineComponent<HTMLAttributes & typeof sliderProps>
export type SliderInstance = InstanceType<DefineComponent<SliderProps>>
