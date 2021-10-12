import type { SetupContext } from 'vue'
import type { SliderThumbProps } from './types'

import { defineComponent, ref } from 'vue'
import { IxTooltip } from '@idux/components/tooltip'
import { sliderThumbProps } from './types'
import { isFunction, debounce } from 'lodash-es'
import { callEmit } from '@idux/cdk/utils'
// import { useThumbs } from './useThumb'

export default defineComponent({
  name: 'IxSliderThumb',
  components: { IxTooltip },
  inheritAttrs: false,
  props: sliderThumbProps,
  setup(props: SliderThumbProps, { attrs }: SetupContext) {
    const { visible, tooltipRef, onMouseEnter, onMouseLeave, onMouseDown } = useThumbs(props)

    return () => {
      const slots = {
        title: () =>
          isFunction(props.tooltipFormatter) ? props.tooltipFormatter(props.value) : <span>{props.value}</span>,
      }

      // const style = {
      //   ...props.baseStyle,

      //    /* stylelint-disable-next-line property-no-unknown */
      //   [direction.value]: `${position.value}%`
      // }

      return (
        <IxTooltip ref={tooltipRef} v-slots={slots} visible={visible.value} trigger="manual">
          <div
            {...attrs}
            class="ix-slider-thumb"
            role="slider"
            tabindex={props.disabled ? -1 : 0}
            style={props.baseStyle}
            onFocus={onMouseEnter}
            onBlur={onMouseLeave}
            onMouseenter={onMouseEnter}
            onMouseleave={onMouseLeave}
            onMousedown={onMouseDown}
          ></div>
        </IxTooltip>
      )
    }
  },
})

function useThumbs(props: SliderThumbProps) {
  const { visible, showTooltip, hideTooltip, tooltipRef } = useTooltip(props)

  function onMouseEnter() {
    callEmit(props.onMouseEnter)
    showTooltip()
  }

  function onMouseLeave() {
    callEmit(props.onMouseLeave)
    if (!props.dragging) {
      hideTooltip()
    }
  }

  function onMouseDown(ev: MouseEvent | TouchEvent) {
    if (props.disabled) {
      return
    }

    callEmit(props.onDragStart, ev)
  }

  return {
    visible,
    tooltipRef,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
  }
}

function useTooltip(props: SliderThumbProps) {
  const tooltipRef = ref<HTMLElement | null>(null)
  const visible = ref(props.tooltipVisible ?? false)

  const showTooltip = debounce(() => {
    if (props.tooltipVisible !== false) {
      visible.value = true
    }
  }, 50)

  const hideTooltip = debounce(() => {
    if (!props.tooltipVisible) {
      visible.value = false
    }
  }, 50)

  return {
    visible,
    tooltipRef,
    showTooltip,
    hideTooltip,
  }
}
