<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const challenge = useChallengeStore()
const api = useApi()

useSeoMeta({
  title: `${t('Confirm your authentication')} | ${ui.title}`
})

const field: Ref<string> = ref('')
const saving: Ref<boolean> = ref(false)
const error: Ref<boolean> = ref(false)

const codeValid = computed(() => {
  return /^[0-9]{6}$/.test(field.value)
})

async function saveTotp() {
  if (!codeValid.value) return
  saving.value = true
  error.value = false
  try {
    const ret = await api.post(
      `/auth/challenges/${route.query.challenge_id}/totp/verify`,
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
    <div class="mb-4 text-4xl">
      <UIcon name="i-heroicons-key-solid" class="" />
    </div>
    <h1 class="text-xl font-bold">
      {{
        challenge.totpType === 'google'
          ? $t('Open Google Authenticator and confirm your authentication')
          : $t('Open your TOTP provider and confirm your authentication')
      }}
    </h1>
    <p class="my-4">
      {{ $t(`Enter below your 6-digits code :`) }}
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
  </UCard>
</template>

<style lang="scss" scoped></style>
