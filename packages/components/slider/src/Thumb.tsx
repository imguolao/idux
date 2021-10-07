import type { SliderThumbProps } from './types'

import { defineComponent, ref } from 'vue'
import { IxTooltip } from '@idux/components/tooltip'
import { sliderThumbProps } from './types'
import { isFunction } from 'lodash-es'

export default defineComponent({
  name: 'IxSliderThumb',
  components: { IxTooltip },
  props: sliderThumbProps,
  setup(props: SliderThumbProps) {
    const visible = ref<boolean>(true)

    return { visible }
  },
  render() {
    const { tabIndex, tooltipFormatter, visible, value } = this
    const slots = {
      title: () => isFunction(tooltipFormatter) ? tooltipFormatter(value) : <span>{value}</span>
    }
    
    return (
      <IxTooltip 
        v-model={visible}
        v-slots={slots}>
        <div class="ix-slider-thumb" tabindex={tabIndex}></div>
      </IxTooltip>
    )
  }
})
