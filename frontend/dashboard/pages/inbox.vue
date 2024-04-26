<script setup lang="ts">
const data = reactive({ address: '662b656f211c4d34958181a2' })
const fields = {
  address: {
    type: 'ref',
    title: 'Adresse',
    description: 'Bar',
    model: 'test'
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="inbox" :width="1000">
      <UDashboardNavbar title="Inbox"> </UDashboardNavbar>
      <div class="grow overflow-auto">
        <!-- ~/components/inbox/InboxList.vue -->
        <FormContainer
          v-model="data"
          :fields="fields"
          class="p-8"
        ></FormContainer>
      </div>
    </UDashboardPanel>
    <UDashboardPanel id="inbox2" :width="300">
      <pre>{{ JSON.stringify(data, null, 4) }}</pre>
    </UDashboardPanel>
  </UDashboardPage>
</template>
