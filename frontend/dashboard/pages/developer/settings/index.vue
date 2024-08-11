<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

const fields = [
  'title',
  'description',
  'logo',
  'logoBackground',
  'logoSize',
  'color',
  'languages',
  'roles'
]
const form = reactive({})
const ready = ref(false)
const api = useApi()
const toast = useToast()

const conf = {
  title: {
    type: 'text',
    title: t('Title')
  },
  description: {
    type: 'text',
    title: t('Description')
  },
  logo: {
    type: 'image',
    title: t('Logo'),
    resize: true,
    crop: false,
    maxHeight: 512,
    maxWidth: 512
  },
  logoBackground: {
    type: 'text',
    title: t('Logo background color')
  },
  logoSize: {
    type: 'enum',
    title: t('Logo size'),
    values: [
      {
        label: t('Do not crop'),
        value: 'contain'
      },
      {
        label: t('Crop'),
        value: 'cover'
      }
    ]
  },
  color: {
    type: 'text',
    title: t('Theme color')
  },
  languages: {
    type: 'enum',
    title: t('Languages'),
    multiple: true,
    values: Object.entries(useLanguages(locale.value)).map(([code, label]) => ({
      label,
      value: code
    }))
  },
  roles: {
    type: 'text',
    title: t('Roles'),
    multiple: true
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
