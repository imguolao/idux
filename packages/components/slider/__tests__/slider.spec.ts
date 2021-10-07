import { mount, MountingOptions } from '@vue/test-utils'
import { renderWork } from '@tests'
import Slider from '../src/Slider'
import { SliderProps } from '../src/types'

describe('Slider', () => {
  const SliderMount = (options?: MountingOptions<Partial<SliderProps>>) => mount(Slider, { ...(options as MountingOptions<SliderProps>)})

  renderWork<SliderProps>(Slider,{
    props: { },
  })
})
