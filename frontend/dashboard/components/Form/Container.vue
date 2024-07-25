<script setup>
const { t, locale } = useI18n({ useScope: 'global' })
const api = useApi()

const props = defineProps({
  fields: {},
  submitButtonLabel: { type: String },
  uploadFiles: { type: Boolean, default: false },
  allowSubmit: { type: Boolean, default: true }
})
const model = defineModel()
const emit = defineEmits(['submit'])

const lastFields = reactive({})
let validator = {}
const loading = ref(true)
watch(
  [() => props.schema, () => props.fields],
  async () => {
    loading.value = true
    if (!model.value) model.value = {}
    Object.assign(lastFields, props.fields)
    const schema = await api.post('/schemas/to-json-schema', lastFields)
    validator = useAjv(schema, locale.value)
    loading.value = false
  },
  { deep: true, immediate: true }
)

async function validate (state) {
  if (!validator) return []
  const errors = validator(state)
  return errors.map(error => ({
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
      v-model="model[key]"
      :conf="conf"
      :name="key"
      :upload-files="uploadFiles"
    />

    <div v-if="allowSubmit">
      <UButton type="submit">
        {{ submitButtonLabel ?? $t('Submit') }}
      </UButton>
    </div>
  </UForm>
</template>
