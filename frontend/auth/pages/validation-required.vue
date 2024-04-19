<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const challenge = useChallengeStore()
const api = useApi()

const allowResend = ref(false)

useSeoMeta({
  title: `${t('Validation required')} | ${ui.title}`
})

async function resend () {
  allowResend.value = false
  try {
    await api.post(`/challenges/${route.query.challenge_id}/validation/retry`)
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
          `Please check your emails, and click in the received email link to validate your email address. If you haven't received this email, you can click the button below in 30s to receive a new one.`
        )
      }}
    </p>

    <UButton color="primary" @click="resend" :disabled="!allowResend">
      {{ $t('Receive a new confirmation email') }}
    </UButton>
  </UCard>
</template>

<style lang="scss" scoped></style>
