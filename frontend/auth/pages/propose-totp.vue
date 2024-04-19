<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const challenge = useChallengeStore()
const api = useApi()

useSeoMeta({
  title: `${t('Enable MFA')} | ${ui.title}`
})

const mode: Ref<string | null> = ref(null)
const image: Ref<string> = ref('')
const field: Ref<string> = ref('')
const saving: Ref<boolean> = ref(false)
const error: Ref<boolean> = ref(false)

const codeValid = computed(() => {
  return /^[0-9]{6}$/.test(field.value)
})

async function google() {
  saving.value = false
  error.value = false
  image.value = ''
  field.value = ''
  mode.value = 'google'
  const imageRet: any = await api.post(
    `/auth/challenges/${route.query.challenge_id}/totp?google=true`
  )
  image.value = imageRet.qrcode
}

async function other() {
  saving.value = false
  error.value = false
  image.value = ''
  field.value = ''
  mode.value = 'other'
  const imageRet: any = await api.post(
    `/auth/challenges/${route.query.challenge_id}/totp?google=false`
  )
  image.value = imageRet.qrcode
}

async function saveTotp() {
  if (!codeValid.value) return
  saving.value = true
  error.value = false
  try {
    await api.post(
      `/auth/challenges/${route.query.challenge_id}/totp/validate`,
      { code: field.value }
    )
  } catch {
    error.value = true
    field.value = ''
  }
  saving.value = false
}

async function no() {
  challenge.ignoreTotp()
  await challenge.handleNewData()
}

onMounted(async () => {
  if (route.query.challenge_id === undefined) {
    router.push(`/error?msg=${encodeURIComponent('No challenge ID.')}`)
    return
  }
})
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard
    class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur text-center"
  >
    <template v-if="mode === null">
      <div class="mb-4 text-4xl">
        <UIcon name="i-heroicons-key-solid" class="" />
      </div>
      <h1 class="text-xl font-bold">
        {{ $t('Enable MFA with your authenticator ?') }}
      </h1>
      <p class="my-4">
        {{
          $t(
            `Secure your account with Google Authenticator or other TOTP provider to avoid identity theft. Please choose your provider below and scan the QRCode with your provider app.`
          )
        }}
      </p>
      <UButton class="mt-4" color="primary" @click="google">
        {{ $t('Google Authenticator') }}
      </UButton>
      <UButton class="mt-4" color="primary" @click="other">
        {{ $t('Other (Microsoft Authenticator, Authy, etc)') }}
      </UButton>
      <UButton class="mt-4" color="gray" variant="outline" @click="no">
        {{ $t('No thanks') }}
      </UButton>
    </template>
    <template v-if="mode === 'google'">
      <UButton class="mb-4" color="gray" variant="outline" @click="mode = null">
        {{ $t('Back') }}
      </UButton>
      <img :src="image" alt="" v-if="image !== ''" class="block mx-auto" />

      <p class="mt-4">
        {{
          $t(
            'Scan the QRCode above in Google Authenticator and enter the given 6-digits code below:'
          )
        }}
      </p>

      <UInput v-model="field" size="xl" class="my-4" @keyup.enter="saveTotp" />
      <UAlert
        v-if="error"
        class="mb-4"
        color="red"
        icon="i-heroicons-information-circle-20-solid"
        :title="$t('The submitted code is invalid')"
      />
      <UButton
        color="primary"
        @click="saveTotp"
        :disabled="!codeValid"
        :loading="saving"
      >
        {{ $t('OK') }}
      </UButton>
    </template>
    <template v-if="mode === 'other'">
      <UButton class="mb-4" color="gray" variant="outline" @click="mode = null">
        {{ $t('Back') }}
      </UButton>
      <img :src="image" alt="" v-if="image !== ''" class="block mx-auto" />

      <p class="mt-4">
        {{
          $t(
            "Scan the QRCode above in your provider's app and enter the given 6-digits code below:"
          )
        }}
      </p>

      <UInput v-model="field" size="xl" class="my-4" @keyup.enter="saveTotp" />
      <UAlert
        v-if="error"
        class="mb-4"
        color="red"
        icon="i-heroicons-information-circle-20-solid"
        :title="$t('The submitted code is invalid')"
      />
      <UButton
        color="primary"
        @click="saveTotp"
        :disabled="!codeValid"
        :loading="saving"
      >
        {{ $t('OK') }}
      </UButton>
    </template>
  </UCard>
</template>

<style lang="scss" scoped></style>
