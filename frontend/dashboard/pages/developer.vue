<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const auth = useAuthStore()

if (auth.hasRole('$developer') === false) {
  useRouter.push('/')
}

const links = [
  [
    {
      label: t('Models'),
      icon: 'i-material-symbols-database',
      to: '/developer/models'
    },
    {
      label: t('Functions'),
      icon: 'i-material-symbols-function',
      to: '/developer/functions'
    },
    {
      label: t('Plugins'),
      icon: 'i-clarity-plugin-solid',
      to: '/developer/plugins'
    },
    {
      label: t('Developer settings'),
      icon: 'i-heroicons-code-bracket',
      to: '/developer/settings'
    }
  ]
]
useHead({
  title: t('Developer')
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Developer')" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <div class="grow overflow-auto">
        <NuxtPage />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
