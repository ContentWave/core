<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

const fields = ['uploadAllowedMimes', 'fileUploadLimit']
const form = reactive({})
const ready = ref(false)
const api = useApi()
const toast = useToast()

const conf = {
  uploadAllowedMimes: {
    type: 'text',
    title: t('Allowed MIME types for file upload'),
    multiple: true
  },
  fileUploadLimit: {
    type: 'integer',
    title: t('File upload limit (in bytes)')
  }
}

async function save () {
  await Promise.all(
    fields.map(field =>
      api.post(`/dashboard/config/${field}`, { value: form[field] })
    )
  )
  toast.add({ title: t('Updates saved!') })
}

onMounted(async () => {
  const data = Object.fromEntries(
    await Promise.all(
      fields.map(
        field =>
          new Promise(async (resolve, reject) => {
            try {
              const { value } = await api.get(`/dashboard/config/${field}`)
              resolve([field, value])
            } catch (err) {
              reject(err)
            }
          })
      )
    )
  )
  Object.assign(form, data)
  ready.value = true
})
</script>

<template>
  <UDashboardPanelContent class="pb-24 px-4" v-if="ready">
    <FormContainer
      v-model="form"
      :fields="conf"
      uploadFiles
      :submitButtonLabel="$t('Save changes')"
      @submit="save"
    ></FormContainer>
  </UDashboardPanelContent>
</template>
