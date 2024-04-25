<script setup>
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import localize from 'ajv-i18n'

const ajv = new Ajv()
addFormats(ajv)

const { t, locale } = useI18n({ useScope: 'global' })
const api = useApi()

const props = defineProps({
  fields: {},
  submitButtonLabel: { type: String }
})
const model = defineModel()

const lastFields = reactive({})
let validator = {}
const loading = ref(true)
watch(
  [() => props.schema, () => props.fields],
  async () => {
    loading.value = true
    if (!model) model.value = {}
    Object.assign(lastFields, props.fields)
    const schema = await api.post('/schemas/to-json-schema', lastFields)
    validator = ajv.compile(schema)
    loading.value = false
  },
  { deep: true, immediate: true }
)

async function validate (state) {
  if (!validator) return []
  const valid = validator(state)
  if (valid) return []
  if (localize[locale.value] !== undefined)
    localize[locale.value](validator.errors)
  return (validator.errors ?? []).map(error => ({
    path: error.instancePath.substring(1).replace(/\//g, '.'),
    message: error.message ?? t('This value is invalid.')
  }))
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="model"
    @submit="$emit('submit')"
    v-if="!loading"
    class="flex flex-col gap-4"
  >
    <FormField
      v-for="(conf, key) in lastFields"
      :key="key"
      :conf="conf"
      :name="key"
      v-model="model[key]"
    />

    <div>
      <UButton type="submit">
        {{ submitButtonLabel ?? $t('Submit') }}
      </UButton>
    </div>
  </UForm>
</template>
