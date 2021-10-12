<template>
  <IxSlider v-model:value="firstVal" vertical :style="style" />
  <IxSlider v-model:value="secondVal" range vertical :style="style" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const firstVal = ref(0)
    const secondVal = ref([20, 50])
    const style = {
      display: 'inline-block',
      height: '300px',
      marginLeft: '80px',
    }

    return { firstVal, secondVal, style }
  },
})
</script>
