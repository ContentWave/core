<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)

onMounted(() => {
  if (!model.value) model.value = 0
  inSetup.value = false
})
</script>

<template>
  <UInput type="number" v-model.number="model" v-if="!inSetup" />
</template>
