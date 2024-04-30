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
  <UInput
    v-model="model"
    placeholder="https://www.example.com"
    v-if="!inSetup"
  />
</template>
