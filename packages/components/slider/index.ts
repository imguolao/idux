import type { SliderComponent } from './src/types'

import Slider from './src/Slider'

const IxSlider = Slider as unknown as SliderComponent

export { IxSlider }

export type { SliderInstance, SliderPublicProps as SliderProps } from './src/types'
