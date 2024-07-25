<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
useHead({
  title: t('Functions | Developer')
})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Functions')" />

      <div class="md:grow md:overflow-auto">Pwet</div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
