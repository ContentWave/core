<script setup>
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  fields: {},
  submitButtonLabel: { type: String },
  uploadFiles: { type: Boolean, default: false }
})

const opened = ref(false)
const fields = ref({})
const submitButtonLabel = ref('')
const uploadFiles = ref(false)
const title = ref('')
const resolve = ref(null)
const reject = ref(null)
const value = ref({})

function fill (
  titleValue,
  fieldsValue,
  defaultValue = {},
  submitButtonLabelValue = undefined,
  uploadFilesValue = false
) {
  return new Promise((resolveFn, rejectFn) => {
    resolve.value = resolveFn
    reject.value = rejectFn
    title.value = titleValue
    fields.value = fieldsValue
    submitButtonLabel.value = submitButtonLabelValue ?? t('OK')
    uploadFiles.value = uploadFilesValue
    value.value = JSON.parse(JSON.stringify(defaultValue))
    opened.value = true
  })
}

defineExpose({ fill })

function cancel () {
  reject.value()
  opened.value = false
}

function submit () {
  resolve.value(value.value)
  opened.value = false
}
</script>

<template>
  <UModal v-model="opened" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="cancel"
          />
        </div>
      </template>

      <FormContainer
        v-model="value"
        :fields="fields"
        :submit-button-label="submitButtonLabel"
        :upload-files="uploadFiles"
        @submit="submit"
      />
    </UCard>
  </UModal>
</template>
