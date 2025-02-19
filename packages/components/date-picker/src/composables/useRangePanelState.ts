/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { DateRangePanelProps } from '../types'
import type { DateConfig } from '@idux/components/config'

import { type ComputedRef, computed, watch } from 'vue'

import { callEmit, convertArray, useState } from '@idux/cdk/utils'

import { applyDateTime, sortRangeValue } from '../utils'

export interface RangePanelStateContext {
  panelValue: ComputedRef<(Date | undefined)[] | undefined>
  isSelecting: ComputedRef<boolean>
  handleChange: (value: (Date | undefined)[]) => void
  handleDatePanelCellClick: (value: Date) => void
  handleDatePanelCellMouseenter: (value: Date) => void
}

export function useRangePanelState(props: DateRangePanelProps, dateConfig: DateConfig): RangePanelStateContext {
  const [selectingDates, setSelectingDates] = useState<(Date | undefined)[] | undefined>(props.value)
  const [isSelecting, setIsSelecting] = useState<boolean>(false)

  watch(
    () => props.visible,
    () => {
      setIsSelecting(false)
    },
  )

  const panelValue = computed(() => {
    if (isSelecting.value) {
      return sortRangeValue(dateConfig, [...convertArray(selectingDates.value)], 'date')
    }

    return convertArray(props.value)
  })

  const handleChange = (value: (Date | undefined)[]) => {
    const sortedRangeValue = sortRangeValue(dateConfig, value, 'date') as Date[]
    callEmit(props.onChange, sortedRangeValue)
    callEmit(props.onSelect, sortedRangeValue)
  }

  const handleDatePanelCellClick = (value: Date) => {
    if (!isSelecting.value) {
      setIsSelecting(true)
      setSelectingDates([value, undefined])
      callEmit(props.onSelect, [value, undefined])
    } else {
      const propsValue = convertArray(props.value)

      handleChange(
        [selectingDates.value?.[0], value].map((dateValue, index) =>
          propsValue[index]
            ? applyDateTime(dateConfig, propsValue[index], dateValue!, ['hour', 'minute', 'second'])
            : dateValue,
        ),
      )
      setIsSelecting(false)
    }
  }

  const handleDatePanelCellMouseenter = (value: Date) => {
    if (!isSelecting.value) {
      return
    }

    setSelectingDates([selectingDates.value?.[0], value])
  }

  return {
    panelValue,
    isSelecting,
    handleChange,
    handleDatePanelCellClick,
    handleDatePanelCellMouseenter,
  }
}
