import type { SliderProps } from './types'

import { defineComponent, computed, ref } from 'vue'
import { sliderProps } from './types'
import IxSliderThumb from './Thumb'

export default defineComponent({
  name: 'IxSlider',
  components: { IxSliderThumb },
  props: sliderProps,
  setup(props) {
    const wrapperClass = useClasses(props)
    
    return { wrapperClass }
  },
  render() {
    const { disabled, range, wrapperClass } = this
    
    return (
      <div class={wrapperClass}>
        <div class="ix-slider-rail"></div>
        <div class="ix-slider-track"></div>
        <div class="ix-slider-step"></div>
        <IxSliderThumb tabIndex={disabled ? -1 : 0}></IxSliderThumb>
        { range && <IxSliderThumb tabIndex={disabled ? -1 : 0}></IxSliderThumb> }
        <div class="ix-slider-mark"></div>
      </div>
    )
  }
})

function useClasses(props: SliderProps) {
  return computed(() => {
    const prefixCls = 'ix-slider'
    return {
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: !!props.disabled,
    }
  })
}

function useThumbs(props: SliderProps) {
  const thumbsValue = ref<number[]>()
  return computed(() => {

  })
}
