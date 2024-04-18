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
  title: `${t('Register')} | ${ui.title}`
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
  if (!state.firstname)
    errors.push({ path: 'firstname', message: t('Firstname is required') })
  if (!state.lastname)
    errors.push({ path: 'lastname', message: t('Lastname is required') })
  if (!state.password)
    errors.push({ path: 'password', message: t('Password is required') })
  if (!state.password_confirm)
    errors.push({ path: 'password', message: t('Password is required') })
  if (
    state.password_confirm &&
    state.password &&
    state.password_confirm !== state.password
  )
    errors.push({
      path: 'password_confirm',
      message: t('Passwords are not the same')
    })
  return errors
}

async function onSubmit(data: any) {
  loading.value = true
  error.value = false
  try {
    const ret = await api.post(
      `/auth/challenges/${route.query.challenge_id}/register`,
      {
        firstname: data.firstname,
        lastname: data.lastname,
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
      name: 'firstname',
      type: 'text',
      label: t('Firstname'),
      placeholder: 'John'
    })
    fields.value.push({
      name: 'lastname',
      type: 'text',
      label: t('Lastname'),
      placeholder: 'Doe'
    })
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
    fields.value.push({
      name: 'password_confirm',
      label: t('Confirm password'),
      type: 'password',
      placeholder: t('Confirm your password')
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
      :title="$t('Create an account')"
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
      <template #description v-if="auth.conf.password">
        {{ $t('Already register ?') }}
        <NuxtLink
          :to="`/login?challenge_id=${$route.query.challenge_id}`"
          class="text-primary font-medium"
          >{{ $t('Login') }}</NuxtLink
        >.
      </template>
      <template #validation>
        <UAlert
          v-if="error"
          color="red"
          icon="i-heroicons-information-circle-20-solid"
          :title="$t('Cannot register, please try again')"
        />
      </template>
    </UAuthForm>
  </UCard>
</template>

<style lang="scss" scoped></style>
