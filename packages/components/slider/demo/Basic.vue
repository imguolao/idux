<template>
  <IxSlider v-model:value="firstVal" :disabled="disabled" />
  <IxSlider v-model:value="secondVal" range :disabled="disabled" />
  Disabled: <IxSwitch v-model:checked="disabled" size="small" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const firstVal = ref(0)
    const secondVal = ref([20, 50])
    const disabled = ref(false)

    return { disabled, firstVal, secondVal }
  },
})
</script>
