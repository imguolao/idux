/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { computed, defineComponent, inject, normalizeClass, provide, watch } from 'vue'

import { IxTooltip } from '@idux/components/tooltip'

import { tempSearchStateKey } from '../composables/useSearchStates'
import { useSegmentOverlayUpdate } from '../composables/useSegmentOverlayUpdate'
import { useSegmentStates } from '../composables/useSegmentStates'
import { proSearchContext, searchItemContext } from '../token'
import { searchItemProps } from '../types'
import { renderIcon } from '../utils/RenderIcon'
import Segment from './Segment'

export default defineComponent({
  props: searchItemProps,
  setup(props) {
    const context = inject(proSearchContext)!
    const {
      props: proSearchProps,
      mergedPrefixCls,
      activeSegment,
      changeActive,
      setActiveSegment,
      removeSearchState,
    } = context

    const prefixCls = computed(() => `${mergedPrefixCls.value}-search-item`)

    const segmentStateContext = useSegmentStates(props, proSearchProps, context)
    const segmentOverlayUpdateContext = useSegmentOverlayUpdate()
    const { segmentStates, initSegmentStates } = segmentStateContext

    provide(searchItemContext, {
      ...segmentStateContext,
      ...segmentOverlayUpdateContext,
    })

    const segmentRenderDatas = computed(() => {
      const searchItem = props.searchItem!

      return searchItem.segments.map(segment => {
        const segmentState = segmentStates.value[segment.name]
        return {
          ...segment,
          input: segmentState.input,
          value: segmentState.value,
        }
      })
    })

    const isActive = computed(() => activeSegment.value?.itemKey === props.searchItem!.key)
    watch(isActive, active => {
      if (!active) {
        initSegmentStates()
      }
    })

    const classes = computed(() => {
      return normalizeClass({
        [prefixCls.value]: true,
        [`${prefixCls.value}-tag`]: !isActive.value,
        [`${prefixCls.value}-invalid`]: !!props.searchItem?.error,
      })
    })

    const setSegmentActive = (name: string) => {
      setActiveSegment({
        itemKey: props.searchItem!.key,
        name,
      })
    }
    const handleCloseIconClick = (evt: Event) => {
      evt.stopPropagation()
      removeSearchState(props.searchItem!.key)
    }

    const handleTagSegmentMouseDown = (evt: Event, name: string) => {
      if (proSearchProps.disabled) {
        return
      }

      setSegmentActive(name)

      if (name === 'name') {
        changeActive(1)
      }
    }

    const renderTag = () => {
      const content = segmentRenderDatas.value.map(data => data.input).join(' ')

      return [
        <span class={`${prefixCls.value}-tag-segments`} title={content}>
          {segmentRenderDatas.value.map(data => (
            <span
              class={`${prefixCls.value}-tag-segment`}
              onMousedown={evt => handleTagSegmentMouseDown(evt, data.name)}
            >
              {data.input}
            </span>
          ))}
        </span>,
        <span class={`${prefixCls.value}-tag-content`} title={content}>
          {content}
        </span>,
      ]
    }

    return () => {
      const children = []

      if (!props.tagOnly) {
        children.push(
          ...segmentRenderDatas.value.map(segment => (
            <Segment
              v-show={isActive.value}
              key={segment.name}
              itemKey={props.searchItem!.key}
              input={segment.input}
              value={segment.value}
              disabled={segment.name === 'name' && props.searchItem!.key !== tempSearchStateKey}
              segment={segment}
            />
          )),
        )
      }

      if (!isActive.value) {
        children.push(...renderTag())

        if (!proSearchProps.disabled) {
          children.push(
            <span class={`${prefixCls.value}-close-icon`} onClick={handleCloseIconClick}>
              {renderIcon('close')}
            </span>,
          )
        }
      }

      const itemNode = (
        <span
          class={classes.value}
          v-show={(isActive.value && !proSearchProps.disabled) || props.searchItem?.key !== tempSearchStateKey}
          onMousedown={evt => evt.preventDefault()}
        >
          {children}
        </span>
      )

      const message = props.searchItem?.error?.message
      if (isActive.value || !message) {
        return itemNode
      }

      return (
        <IxTooltip class={`${prefixCls.value}-invalid-tooltip`} title={message} placement="topStart" offset={[0, 15]}>
          {itemNode}
        </IxTooltip>
      )
    }
  },
})
