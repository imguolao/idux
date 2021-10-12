import type { ComputedRef, Ref } from 'vue'
import type { SliderProps } from './types'
import type { FormAccessor } from '@idux/cdk/forms'

import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { sliderProps } from './types'
import { useValueAccessor } from '@idux/cdk/forms'
import { callEmit, throwError, isNumeric, getClientXY, on, off } from '@idux/cdk/utils'
import { useFormItemRegister } from '@idux/components/form'
import IxSliderThumb from './Thumb'
// import { useSlider } from './useSlider'
// import { sliderInjectionKey } from './injectionSymbols'
import { sliderStartDirection } from './types'

export default defineComponent({
  name: 'IxSlider',
  components: { IxSliderThumb },
  props: sliderProps,
  setup(props) {
    const accessor = useSliderAccessor()
    const { direction, dragging, isDisabled, thumbs, values } = useSlider(props, accessor)
    const { railRef, onDragStart } = useSliderDrag(props, values, thumbs, dragging)
    const wrapperClass = useClasses(props, isDisabled)
    const { trackStyle } = useTrack(props, values, direction)

    // provide(sliderInjectionKey, {
    //   ...toRefs(props),
    //   isDisabled,
    //   direction,
    //   precision,
    //   getRailSize,
    // })

    // return { isDisabled, thumbs, values, trackStyle, wrapperClass, railRef }
    return () => {
      return (
        <div class={wrapperClass.value}>
          <div class="ix-slider-rail" ref={railRef}></div>
          <div class="ix-slider-track" style={trackStyle.value}></div>
          <div class="ix-slider-step"></div>
          {thumbs.value.map(({ val, style }, index) => (
            <IxSliderThumb
              value={val}
              aria-label="Slider"
              aria-valuemin={props.min}
              aria-valuemax={props.max}
              aria-valuenow={val}
              aria-readonly={isDisabled}
              aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
              key={`slider-thumb-${index}`}
              baseStyle={style}
              disabled={isDisabled.value}
              dragging={dragging.value}
              onDragStart={(ev: MouseEvent | TouchEvent) => onDragStart(ev, index)}
            />
          ))}
          <div class="ix-slider-mark"></div>
        </div>
      )
    }
  },
  // render() {
  //   const { isDisabled, max, min, thumbTransform, values, vertical, trackStyle, wrapperClass } = this

  //   return (
  //     <div class={wrapperClass}>
  //       <div class="ix-slider-rail" ref="railRef"></div>
  //       <div class="ix-slider-track" style={trackStyle}></div>
  //       <div class="ix-slider-step"></div>
  //       {values.map((val, i) => (
  //         <IxSliderThumb
  //           value={val}
  //           aria-label="Slider"
  //           aria-valuemin={min}
  //           aria-valuemax={max}
  //           aria-valuenow={val}
  //           aria-readonly={isDisabled}
  //           aria-orientation={vertical ? 'vertical' : 'horizontal'}
  //           key={`slider-thumb-${i}`}
  //           baseStyle={{ transform: thumbTransform }}
  //           onDragStart={() => console.log(i)}
  //         />
  //       ))}
  //       <div class="ix-slider-mark"></div>
  //     </div>
  //   )
  // },
})

const SLIDER_DEFAULT_VALUE = 0
const SLIDER_DEFAULT_RAIL_LEN = 0

function useSlider(props: SliderProps, accessor: FormAccessor) {
  const dragging = ref(false)
  const values = ref<number[]>([])
  const isDisabled = computed(() => accessor?.disabled)
  const direction = computed(() =>
    props.vertical
      ? props.reverse
        ? sliderStartDirection.ttb
        : sliderStartDirection.btt
      : props.reverse
      ? sliderStartDirection.rtl
      : sliderStartDirection.ltr,
  )

  const transform = computed(() =>
    props.vertical
      ? props.reverse
        ? `translateY(-50%)`
        : `translateY(50%)`
      : props.reverse
      ? `translateX(50%)`
      : `translateX(-50%)`,
  )

  const thumbs = computed(() =>
    values.value?.map(v => {
      const position = ((v - props.min) / (props.max - props.min)) * 100
      return {
        val: v,
        pos: position,
        style: {
          transform: transform.value,
          [direction.value]: `${position}%`,
        },
      }
    }),
  )

  watch(
    () => props.value,
    (val, oldVal) => {
      console.log(val, oldVal, dragging.value)
      if (dragging.value || (Array.isArray(val) && Array.isArray(oldVal) && val.every((v, i) => v === oldVal[i]))) {
        return
      }
      setValues()
    },
    { immediate: true },
  )

  watch(
    () => [props.max, props.min, props.range],
    () => {
      setValues()
    },
  )

  function setValues() {
    if (props.min > props.max) {
      throwError('Slider', 'min should not be greater than max.')
      return
    }

    let val: number[]
    if (props.range) {
      if (!Array.isArray(props.value)) {
        throwError('Slider', 'value should be number[] in range mode.')
        return
      }

      val = [props.value[0] ?? SLIDER_DEFAULT_VALUE, props.value[1] ?? SLIDER_DEFAULT_VALUE]
    } else {
      if (!isNumeric(props.value)) {
        throwError('Slider', 'value should be a number.')
        return
      }

      val = [props.value as number]
    }

    const newVal = val
      .map(num => {
        if (!isNumeric(num)) {
          return SLIDER_DEFAULT_VALUE
        }

        return Math.max(props.min, Math.min(props.max, num))
      })
      .sort((a, b) => a - b) // order

    // update value
    if (val.every((v, i) => v !== newVal[i])) {
      const res = props.range ? newVal : newVal[0]
      callEmit(props.onChange, res)
      accessor.setValue?.(res)
      return
    }

    values.value = newVal
  }

  return {
    dragging,
    values,
    isDisabled,
    direction,
    thumbs,
  }
}

interface ThumbData {
  val: number
  pos: number
  style: Record<string, string>
}

function useSliderDrag(
  props: SliderProps,
  values: Ref<number[]>,
  thumbs: ComputedRef<ThumbData[]>,
  dragging: Ref<boolean>,
) {
  const { startPosition, newPosition, setStartStatus, getDistance } = useDragDistance()
  const railRef = ref<HTMLElement | null>(null)
  const currIndex = ref(-1)
  const precision = computed(() => {
    const precisions = [props.min, props.max, props.step].map(num => {
      const decimal = `${num}`.split('.')[1]
      return decimal ? decimal.length : 0
    })
    return Math.max(...precisions)
  })

  const emitValue = computed(() => {
    const val = [...values.value].sort((a, b) => a - b)
    return props.range ? val : val[0]
  })

  function getRailSize() {
    if (railRef.value) {
      const railClientRect = railRef.value.getBoundingClientRect()
      return props.vertical ? railClientRect.height : railClientRect.width
    }

    return SLIDER_DEFAULT_RAIL_LEN
  }

  function onDragStart(ev: MouseEvent | TouchEvent, index: number) {
    dragging.value = true
    currIndex.value = index
    setStartStatus(ev, thumbs.value[index].pos)

    on(window, 'mousemove', onDragging)
    on(window, 'touchmove', onDragging)
    on(window, 'mouseup', onDragEnd)
    on(window, 'touchend', onDragEnd)
    on(window, 'contextmenu', onDragEnd)
  }

  function onDragging(ev: MouseEvent | TouchEvent) {
    if (dragging.value) {
      const distance = getDistance(ev, props.vertical)
      const railSize = getRailSize()
      newPosition.value = startPosition.value + (distance / railSize) * 100
      setValueByPosition(newPosition.value)
    }
  }

  async function onDragEnd(ev: MouseEvent | TouchEvent) {
    ev.preventDefault()
    dragging.value = false
    currIndex.value = -1

    // setValueByPosition(newPosition.value)
    // await nextTick()
    console.log('end', dragging.value)
    values.value = values.value.sort((a, b) => a - b)
    callEmit(props['onUpdate:value'], emitValue.value)
    callEmit(props.onChange, emitValue.value)
    off(window, 'mousemove', onDragging)
    off(window, 'touchmove', onDragging)
    off(window, 'mouseup', onDragEnd)
    off(window, 'touchend', onDragEnd)
    off(window, 'contextmenu', onDragEnd)
  }

  function setValueByPosition(pos: number) {
    if (pos === null || isNaN(pos)) {
      return
    }

    pos = Math.max(0, Math.min(100, pos))

    const lengthPerStep = 100 / ((props.max - props.min) / props.step)
    const steps = Math.round(pos / lengthPerStep)
    const newValue = steps * lengthPerStep * (props.max - props.min) * 0.01 + props.min
    values.value[currIndex.value] = parseFloat(newValue.toFixed(precision.value))
    // values.value = [...values.value].sort((a, b) => a - b)
    callEmit(props['onUpdate:value'], emitValue.value)
    callEmit(props.onInput, emitValue.value)
  }

  return {
    railRef,
    getRailSize,
    onDragStart,
    onDragging,
    onDragEnd,
  }
}

function useDragDistance() {
  let startX = 0
  let startY = 0
  const startPosition = ref(0)
  const newPosition = ref(0)

  function setStartStatus(ev: MouseEvent | TouchEvent, pos: number) {
    const { clientX, clientY } = getClientXY(ev)
    startX = clientX
    startY = clientY
    startPosition.value = pos
    newPosition.value = pos
  }

  function getDistance(ev: MouseEvent | TouchEvent, isVertical: boolean) {
    return isVertical ? startY - getClientXY(ev).clientY : getClientXY(ev).clientX - startX
  }

  return {
    startPosition,
    newPosition,
    setStartStatus,
    getDistance,
  }
}

function useSliderAccessor() {
  const { accessor } = useValueAccessor()
  useFormItemRegister()
  return accessor
}

function useClasses(props: SliderProps, isDisabled: Ref<boolean>) {
  return computed(() => {
    const prefixCls = 'ix-slider'
    return {
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: isDisabled.value,
      [`${prefixCls}-vertical`]: !!props.vertical,
    }
  })
}

function useTrack(props: SliderProps, values: Ref<number[]>, direction: Ref<string>) {
  const maxValue = computed(() => Math.max(...values.value))
  const minValue = computed(() => Math.min(...values.value))
  const trackStyle = computed(() => {
    const isMultiThumb = values.value?.length > 1
    return {
      [direction.value]: isMultiThumb ? `${((minValue.value - props.min) / (props.max - props.min)) * 100}%` : '0%',
      [props.vertical ? 'height' : 'width']: isMultiThumb
        ? `${((maxValue.value - minValue.value) / (props.max - props.min)) * 100}%`
        : `${((+values.value[0] - props.min) / (props.max - props.min)) * 100}%`,
    }
  })

  return { trackStyle }
}
