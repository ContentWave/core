<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)
const { locale } = useI18n({ useScope: 'global' })

onMounted(() => {
  if (!model.value) model.value = null
  inSetup.value = false
})

const options = computed(() =>
  (props.conf.values ?? []).map(v => ({
    name: useI18nString(v.label, locale.value),
    value: v.value
  }))
)
</script>

<template>
  <USelect
    v-model="model"
    :options="options"
    option-attribute="name"
    v-if="!inSetup"
  />
</template>
