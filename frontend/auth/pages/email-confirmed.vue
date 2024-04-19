<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const ui = useUiStore()
const auth = useAuthStore()
useSeoMeta({
  title: `${t('Email confirmed')} | ${ui.title}`
})
function goBack () {
  window.location.href = auth.conf.defaultRedirectUrl
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard
    class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur text-center"
  >
    <div class="mb-4 text-4xl">
      <UIcon name="i-heroicons-shield-check-solid" class="" />
    </div>
    <h1 class="text-xl font-bold">{{ $t('Email confirmed') }}</h1>
    <p>
      {{
        $t('Your email address has been confirmed, you can now login again.')
      }}
    </p>
    <UButton
      class="mt-4"
      color="gray"
      variant="outline"
      v-if="auth.conf.defaultRedirectUrl"
      @click="goBack"
      >{{ $t('Login') }}</UButton
    >
  </UCard>
</template>
