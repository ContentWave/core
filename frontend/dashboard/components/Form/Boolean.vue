<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)

onMounted(() => {
  if (!model.value) model.value = false
  inSetup.value = false
})
</script>

<template>
  <UCheckbox v-model="model" v-if="!inSetup" />
</template>
