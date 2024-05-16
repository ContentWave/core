<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const loading = ref(false)
const inSetup = ref(true)
const api = useApi()
const options = ref([])

async function search (q) {
  if (q.length === 0) return []
  loading.value = true
  const items = await api.get(
    `/dashboard/projects/${props.conf.project}/models/${props.conf.model}/search`,
    {
      q
    }
  )
  options.value = items
  loading.value = false
  return items
}

onMounted(async () => {
  if (!model.value) model.value = null
  if (model.value) {
    options.value = await api.get(
      `/dashboard/projects/${props.conf.project}/models/${props.conf.model}/${model.value}/name`
    )
  }
  inSetup.value = false
})
</script>

<template>
  <USelectMenu
    v-if="!inSetup"
    v-model="model"
    :options="options"
    :loading="loading"
    :searchable="search"
    :placeholder="$t('Search ...')"
    option-attribute="label"
    value-attribute="value"
    trailing
    by="value"
  />
</template>
