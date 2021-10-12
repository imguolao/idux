/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */

import type { FormAccessor } from '@idux/cdk/forms'
import type { SliderProps } from './types'

import { computed, reactive, watch, toRefs, ref } from 'vue'
import { throwError, callEmit, isNumeric } from '@idux/cdk/utils'
import { sliderStartDirection } from './types'

interface ISliderData {
  dragging: boolean
  values: number[]
}

export const SLIDER_DEFAULT_VALUE = 0
export const SLIDER_DEFAULT_RAIL_LEN = 0

export function useSlider(props: SliderProps, accessor: FormAccessor) {
  const sliderData = reactive<ISliderData>({
    dragging: false,
    values: [],
  })
  const railRef = ref<HTMLElement | null>(null)
  const isDisabled = computed(() => accessor?.disabled)
  const direction = computed(() => {
    return props.vertical
      ? props.reverse
        ? sliderStartDirection.ttb
        : sliderStartDirection.btt
      : props.reverse
      ? sliderStartDirection.rtl
      : sliderStartDirection.ltr
  })
  const thumbTransform = computed(() => {
    return props.vertical
      ? props.reverse
        ? `translateY(-50%)`
        : `translateY(50%)`
      : props.reverse
      ? `translateX(50%)`
      : `translateX(-50%)`
  })

  const precision = computed(() => {
    const precisions = [props.min, props.max, props.step].map(num => {
      const decimal = `${num}`.split('.')[1]
      return decimal ? decimal.length : 0
    })
    return Math.max(...precisions)
  })

  watch(
    () => props.value,
    (val, oldVal) => {
      if (
        sliderData.dragging ||
        (Array.isArray(val) && Array.isArray(oldVal) && val.every((v, i) => v === oldVal[i]))
      ) {
        return
      }
      setValues()
    },
  )

  watch(
    () => [props.max, props.min, props.range],
    () => {
      setValues()
    },
  )

  function getRailSize() {
    if (railRef.value) {
      const railClientRect = railRef.value.getBoundingClientRect()
      return props.vertical ? railClientRect.height : railClientRect.width
    }

    return SLIDER_DEFAULT_RAIL_LEN
  }

  function setValues() {
    console.log('set')
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
      console.log('set', val)
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
      console.log(1)
      const res = props.range ? newVal : newVal[0]
      callEmit(props.onChange, res)
      accessor.setValue?.(res)
      return
    }

    sliderData.values = newVal
  }

  // init
  setValues()

  return {
    ...toRefs(sliderData),
    isDisabled,
    direction,
    precision,
    thumbTransform,
    railRef,
    getRailSize,
  }
}
