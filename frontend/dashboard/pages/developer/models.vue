<script setup lang="ts">
useHead({
  title: 'Models | Developer'
})
const conf = reactive({})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Models')" />

      <div class="md:grow md:overflow-auto p-4">
        <OrmEditor v-model="conf" />

        {{ conf }}
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
