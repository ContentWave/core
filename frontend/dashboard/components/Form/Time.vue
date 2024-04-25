<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
const { locale } = useI18n({ useScope: 'global' })

const props = defineProps({
  conf: {},
  name: { type: String }
})

const model = defineModel()
const inSetup = ref(true)

onMounted(() => {
  if (!model.value) model.value = null
  inSetup.value = false
})
</script>

<template>
  <VueDatePicker
    input-class-name="!rounded-md !placeholder-gray-400 !dark:placeholder-gray-500 !text-sm !bg-white !dark:bg-gray-900 !text-gray-900 !dark:text-white"
    v-model="model"
    model-type="HH:mm:ssX"
    time-picker
    :locale="locale"
  />
</template>
