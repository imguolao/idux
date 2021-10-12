import type { InjectionKey } from 'vue'
import type { SliderProvider } from './types'

export const sliderInjectionKey = Symbol('sliderProvider') as InjectionKey<SliderProvider>
