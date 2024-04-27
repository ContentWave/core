<script setup lang="ts">
const links = [
  [
    {
      label: 'General',
      icon: 'i-heroicons-user-circle',
      to: '/developer/settings',
      exact: true
    },
    {
      label: 'Members',
      icon: 'i-heroicons-user-group',
      to: '/developer/settings/members'
    },
    {
      label: 'Notifications',
      icon: 'i-heroicons-bell',
      to: '/developer/settings/notifications'
    }
  ],
  [
    {
      label: 'Documentation',
      icon: 'i-heroicons-book-open',
      to: 'https://ui.nuxt.com/pro',
      target: '_blank'
    },
    {
      label: 'Buy now',
      icon: 'i-heroicons-credit-card',
      to: 'https://ui.nuxt.com/pro/purchase',
      target: '_blank'
    }
  ]
]
useHead({
  title: 'Settings | Developer'
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
