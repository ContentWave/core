<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const challenge = useChallengeStore()
const api = useApi()

const field: Ref<string> = ref('')
const saving: Ref<boolean> = ref(false)
const error: Ref<boolean> = ref(false)

const codeValid = computed(() => {
  return /^[0-9]{6}$/.test(field.value)
})

const allowResend = ref(false)

useSeoMeta({
  title: `${t('One-time code')} | ${ui.title}`
})

async function sendCode() {
  if (!codeValid.value) return
  saving.value = true
  error.value = false
  try {
    const ret = await api.post(
      `/auth/challenges/${route.query.challenge_id}/one-time-code`,
      {
        code: field.value
      }
    )
    await challenge.updateFromApi(ret)
  } catch {
    error.value = true
    field.value = ''
  }
  saving.value = false
}

async function resend() {
  allowResend.value = false
  try {
    await api.post(
      `/challenges/${route.query.challenge_id}/one-time-code/retry`
    )
  } catch {}
  setTimeout(() => {
    allowResend.value = true
  }, 30000)
}

onMounted(async () => {
  if (route.query.challenge_id === undefined) {
    router.push(`/error?msg=${encodeURIComponent('No challenge ID.')}`)
    return
  }
  setTimeout(() => {
    allowResend.value = true
  }, 30000)
})
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard
    class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur text-center"
  >
    <div class="mb-4 text-4xl">
      <UIcon name="i-heroicons-envelope-open-solid" class="" />
    </div>
    <h1 class="text-xl font-bold">
      {{ $t('Check your emails') }}
    </h1>
    <p class="my-4">
      {{
        $t(
          `Please check your emails, and enter below the received code. If you haven't received this email, you can click the button below in 30s to receive a new one.`
        )
      }}
    </p>

    <UInput v-model="field" size="xl" class="my-4" @keyup.enter="sendCode" />
    <UAlert
      v-if="error"
      class="mb-4"
      color="red"
      icon="i-heroicons-information-circle-20-solid"
      :title="$t('The submitted code is invalid')"
    />
    <UButton
      color="primary"
      @click="sendCode"
      :disabled="!codeValid"
      :loading="saving"
    >
      {{ $t('OK') }}
    </UButton>

    <UButton color="primary" @click="resend" :disabled="!allowResend">
      {{ $t('Receive a new confirmation email') }}
    </UButton>
  </UCard>
</template>

<style lang="scss" scoped></style>
