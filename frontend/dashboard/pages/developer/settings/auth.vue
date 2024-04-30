<script setup>
const { t } = useI18n({ useScope: 'global' })

const form = reactive({})
const ready = ref(false)
const api = useApi()
const toast = useToast()

const conf = {
  register: { type: 'boolean', title: t('Allow users to register') },
  validation: {
    type: 'boolean',
    title: t('Users needs to validate their email address')
  },
  password: { type: 'boolean', title: t('Email / password authentication') },
  magicLink: {
    type: 'boolean',
    title: t('Enable password-less login with magic link by email')
  },
  fido2: {
    type: 'boolean',
    title: t('Enable fast login with FIDO2 (FaceID, fingerprint, ...)')
  },
  passkey: { type: 'boolean', title: t('Enable Passkeys') },
  totp: {
    type: 'boolean',
    title: t(
      'Confirm authentication with TOTP (Google Authenticator, Authy, ...)'
    )
  },
  oneTimeCode: {
    type: 'boolean',
    title: t('Confirm authentication with One-time Code sent by email')
  },
  invite: { type: 'boolean', title: t('Let users invite others') },
  defaultRedirectUrl: {
    type: 'url',
    title: t('Default redirect URL, on error')
  }
}

async function save () {
  await api.post(`/dashboard/config/auth`, { value: form })
  toast.add({ title: t('Updates saved!') })
}

onMounted(async () => {
  const { value } = await api.get(`/dashboard/config/auth`)
  Object.assign(form, value)
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
