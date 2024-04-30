<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })

const links = [
  [
    {
      label: t('General'),
      icon: 'i-material-symbols-settings',
      to: '/developer/settings',
      exact: true
    },
    {
      label: t('Auth'),
      icon: 'i-streamline-interface-user-lock-actions-lock-geometric-human-person-single-up-user',
      to: '/developer/settings/auth'
    },
    {
      label: t('System'),
      icon: 'i-tdesign-system-application',
      to: '/developer/settings/system'
    }
  ]
]
useHead({
  title: t('Settings')
})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Settings')" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <div class="md:grow md:overflow-auto">
        <NuxtPage />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
