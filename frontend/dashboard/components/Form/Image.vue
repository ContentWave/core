<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)

onMounted(() => {
  if (!model.value) model.value = ''
  inSetup.value = false
})
</script>

<template>
  <UInput v-model="model" v-if="!inSetup" />
</template>