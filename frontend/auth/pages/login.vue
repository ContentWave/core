<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const challenge = useChallengeStore()
const config = useRuntimeConfig()
const api = useApi()

useSeoMeta({
  title: `${t('Login')} | ${ui.title}`
})

const fields: Ref<any[]> = ref([])
const providers: Ref<any[]> = ref([])
const loading = ref(false)
const error = ref(false)

const validate = (state: any) => {
  const errors = []
  if (!state.email)
    errors.push({ path: 'email', message: t('Email is required') })
  else if (
    !state.email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    errors.push({ path: 'email', message: t('Email is not valid') })
  if (!state.password)
    errors.push({ path: 'password', message: t('Password is required') })
  return errors
}

async function onSubmit(data: any) {
  loading.value = true
  error.value = false
  try {
    const ret = await api.post(
      `/auth/challenges/${route.query.challenge_id}/login`,
      {
        email: data.email,
        password: data.password
      }
    )
    await challenge.updateFromApi(ret)
  } catch {
    error.value = true
  }
  loading.value = false
}

onMounted(async () => {
  if (route.query.challenge_id === undefined) {
    router.push(`/error?msg=${encodeURIComponent('No challenge ID.')}`)
    return
  }

  if (auth.conf.password) {
    fields.value.push({
      name: 'email',
      type: 'email',
      label: t('Email'),
      placeholder: t('Enter your email')
    })
    fields.value.push({
      name: 'password',
      label: t('Password'),
      type: 'password',
      placeholder: t('Enter your password')
    })
  }

  for (let provider of auth.plugins)
    providers.value.push({
      label: t('Continue with {label}', { label: provider.style.label }),
      icon: provider.style.icon,
      color: 'white' as const,
      click: () => {
        window.location.href = `${config.public.apiUrl}/auth/challenges/${route.query.challenge_id}/social/${provider.key}`
      }
    })

  if (auth.conf.fido2 && isFidoSetup()) {
    loginFido()
  }
})
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      :title="$t('Welcome back')"
      align="bottom"
      icon="i-heroicons-lock-closed"
      :divider="$t('or')"
      :ui="{
        base: 'text-center',
        footer: 'text-center',
        default: { submitButton: { label: $t('Continue') } }
      }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
      :loading="loading"
    >
      <template #description v-if="auth.conf.password && auth.conf.register">
        {{ $t("Don't have an account?") }}
        <NuxtLink
          :to="`/register?challenge_id=${$route.query.challenge_id}`"
          class="text-primary font-medium"
          >{{ $t('Sign up') }}</NuxtLink
        >.
      </template>
      <template #validation>
        <UAlert
          v-if="error"
          color="red"
          icon="i-heroicons-information-circle-20-solid"
          :title="$t('Wrong credentials, please try again')"
        />
      </template>

      <template #password-hint>
        <NuxtLink to="/forgot-password" class="text-primary font-medium">{{
          $t('Forgot password?')
        }}</NuxtLink>
      </template>
    </UAuthForm>
  </UCard>
</template>

<style lang="scss" scoped></style>
