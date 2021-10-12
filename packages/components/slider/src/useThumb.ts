// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// import { SliderThumbProps, SliderProvider } from './types'

// import { computed, ref, inject } from 'vue'
// import { getClientXY, on, off, callEmit } from '@idux/cdk/utils'
// import { debounce } from 'lodash-es'
// import { sliderInjectionKey } from './injectionSymbols'

// export function useThumbs(props: SliderThumbProps) {
//   const { direction, max, min, isDisabled, step, vertical, precision, getRailSize } = inject(
//     sliderInjectionKey,
//   ) as SliderProvider
//   const { visible, showTooltip, hideTooltip, tooltipRef } = useTooltip(props)
//   const { startPosition, newPosition, setStartStatus, getDistance } = useDragDistance()

//   const hovering = ref(false)
//   const dragging = ref(false)
//   const position = computed(() => ((props.value - min.value) / (max.value - min.value)) * 100)

//   function onMouseEnter() {
//     hovering.value = true
//     showTooltip()
//   }

//   function onMouseLeave() {
//     hovering.value = false
//     if (!dragging.value) {
//       hideTooltip()
//     }
//   }

//   function onMouseDown(ev: MouseEvent | TouchEvent) {
//     if (isDisabled.value) {
//       return
//     }

//     ev.preventDefault()
//     onDragStart(ev)
//     on(window, 'mousemove', onDragging)
//     on(window, 'touchmove', onDragging)
//     on(window, 'mouseup', onDragEnd)
//     on(window, 'touchend', onDragEnd)
//     on(window, 'contextmenu', onDragEnd)
//   }

//   function onDragStart(ev: MouseEvent | TouchEvent) {
//     dragging.value = true
//     setStartStatus(ev, position.value)
//   }

//   function onDragging(ev: MouseEvent | TouchEvent) {
//     if (dragging.value) {
//       showTooltip()
//       const distance = getDistance(ev, vertical.value)
//       const railSize = getRailSize()
//       newPosition.value = startPosition.value + (distance / railSize) * 100
//       setValueByPosition(newPosition.value)
//     }
//   }

//   function onDragEnd(ev: MouseEvent | TouchEvent) {
//     ev.preventDefault()
//     dragging.value = false
//     if (!hovering.value) {
//       hideTooltip()
//     }

//     console.log(1)

//     // setValueByPosition(newPosition.value)
//     // emitChange()
//     off(window, 'mousemove', onDragging)
//     off(window, 'touchmove', onDragging)
//     off(window, 'mouseup', onDragEnd)
//     off(window, 'touchend', onDragEnd)
//     off(window, 'contextmenu', onDragEnd)
//   }

//   async function setValueByPosition(pos: number) {
//     if (pos === null || isNaN(pos)) {
//       return
//     }

//     pos = Math.max(0, Math.min(100, pos))

//     const lengthPerStep = 100 / ((max.value - min.value) / step.value)
//     const steps = Math.round(pos / lengthPerStep)
//     const value = steps * lengthPerStep * (max.value - min.value) * 0.01 + min.value
//     // callEmit(props['onUpdate:value'], parseFloat(value.toFixed(precision.value)))
//   }

//   return {
//     direction,
//     max,
//     min,
//     isDisabled,
//     position,
//     vertical,
//     visible,
//     tooltipRef,
//     onMouseEnter,
//     onMouseLeave,
//     onMouseDown,
//     onDragStart,
//     onDragging,
//     onDragEnd,
//   }
// }

// function useTooltip(props: SliderThumbProps) {
//   const tooltipRef = ref<HTMLElement | null>(null)
//   const visible = ref(props.tooltipVisible ?? false)

//   const showTooltip = debounce(() => {
//     if (props.tooltipVisible !== false) {
//       visible.value = true
//     }
//   }, 50)

//   const hideTooltip = debounce(() => {
//     if (!props.tooltipVisible) {
//       visible.value = false
//     }
//   }, 50)

//   return {
//     visible,
//     tooltipRef,
//     showTooltip,
//     hideTooltip,
//   }
// }

// function useDragDistance() {
//   let startX = 0
//   let startY = 0
//   const startPosition = ref(0)
//   const newPosition = ref(0)

//   function setStartStatus(ev: MouseEvent | TouchEvent, pos: number) {
//     const { clientX, clientY } = getClientXY(ev)
//     startX = clientX
//     startY = clientY
//     startPosition.value = pos
//     newPosition.value = pos
//   }

//   function getDistance(ev: MouseEvent | TouchEvent, isVertical: boolean) {
//     return isVertical ? startY - getClientXY(ev).clientY : getClientXY(ev).clientX - startX
//   }

//   return {
//     startPosition,
//     newPosition,
//     setStartStatus,
//     getDistance,
//   }
// }
