<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const challenge = useChallengeStore()
const config = useRuntimeConfig()
useSeoMeta({
  title: `${t('Activate passwordless login')} | ${ui.title}`
})

async function yes () {
  await registerFido(navigator.userAgent)
  challenge.ignoreFido()
  await challenge.handleNewData()
}

async function no () {
  challenge.ignoreFido()
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
    <div class="mb-4 text-4xl">
      <UIcon name="i-heroicons-finger-print-solid" class="" />
    </div>
    <h1 class="text-xl font-bold">{{ $t('Activate passwordless login ?') }}</h1>
    <p class="my-4">
      {{
        $t(
          `The next time you'll have to login, you will be able to log in with your fingerprint, FaceID, or other passwordless method.`
        )
      }}
    </p>
    <UButton class="mt-4 mr-4" color="primary" @click="yes">
      {{ $t('Yes, please') }}
    </UButton>
    <UButton class="mt-4" color="gray" variant="outline" @click="no">
      {{ $t('No thanks') }}
    </UButton>
  </UCard>
</template>

<style lang="scss" scoped></style>
