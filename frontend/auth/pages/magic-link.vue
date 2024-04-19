<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const challenge = useChallengeStore()
const api = useApi()

const field: Ref<string> = ref('')
const saving: Ref<boolean> = ref(false)
const sent: Ref<boolean> = ref(false)

const emailValid = computed(() => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    field.value.toLowerCase()
  )
})

useSeoMeta({
  title: `${t('Magic link')} | ${ui.title}`
})

async function sendEmail() {
  if (!emailValid.value) return
  saving.value = true
  try {
    await api.post(`/auth/challenges/${route.query.challenge_id}/magic-links`, {
      email: field.value.toLowerCase()
    })
  } catch {}
  saving.value = false
  sent.value = true
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
    <UButton
      class="mb-4"
      color="gray"
      variant="outline"
      @click="$router.push(`/login?challenge_id=${$route.query.challenge_id}`)"
    >
      {{ $t('Back') }}
    </UButton>
    <div class="mb-4 text-4xl">
      <UIcon name="i-heroicons-envelope-solid" class="" />
    </div>
    <h1 class="text-xl font-bold">
      {{ $t('Log in without password') }}
    </h1>
    <p class="my-4">
      {{
        $t(
          `Enter your email below to receive an email with a one-time login link.`
        )
      }}
    </p>

    <UAlert
      v-if="sent"
      class="mb-4"
      color="green"
      icon="i-heroicons-check-20-solid"
      :title="$t('Email has been sent')"
    />
    <template v-else>
      <UInput
        type="email"
        v-model="field"
        size="xl"
        class="my-4"
        @keyup.enter="sendEmail"
      />
      <UButton
        color="primary"
        @click="sendEmail"
        :disabled="!emailValid"
        :loading="saving"
      >
        {{ $t('OK') }}
      </UButton>
    </template>
  </UCard>
</template>

<style lang="scss" scoped></style>
