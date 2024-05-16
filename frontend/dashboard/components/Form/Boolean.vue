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
  <div class="flex items-center mt-2">
    <span
      class="text-sm mr-3 opacity-50"
      :class="{ 'font-bold !opacity-100': !model }"
      >{{ $t('No') }}</span
    >
    <UToggle
      on-icon="i-heroicons-check-20-solid"
      off-icon="i-heroicons-x-mark-20-solid"
      v-model="model"
      v-if="!inSetup"
    />
    <span
      class="text-sm ml-3 opacity-50"
      :class="{ 'font-bold !opacity-100': model }"
      >{{ $t('Yes') }}</span
    >
  </div>
</template>
