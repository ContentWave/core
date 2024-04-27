<script setup lang="ts">
useHead({
  title: 'Plugins | Developer'
})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Plugins')" />

      <div class="md:grow md:overflow-auto">Pwet</div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
