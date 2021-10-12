<template>
  <IxRow gutter="16">
    <IxCol flex="auto">
      <IxSlider v-model:value="firstVal" />
    </IxCol>
    <IxCol flex="100px">
      <!-- <IxInput v-model:value="firstVal" /> -->
    </IxCol>
  </IxRow>
  <IxRow gutter="16">
    <IxCol flex="auto">
      <IxSlider v-model:value="secondVal" :step="0.01" :min="0" :max="1" />
    </IxCol>
    <IxCol flex="100px">
      <!-- <IxInput v-model:value="secondVal" /> -->
    </IxCol>
  </IxRow>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const firstVal = ref(0)
    const secondVal = ref(0)

    return { firstVal, secondVal }
  },
})
</script>
