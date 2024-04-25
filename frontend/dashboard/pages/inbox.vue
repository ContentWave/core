<script setup lang="ts">
const data = reactive({})
const fields = {
  test: {
    type: 'ref',
    title: 'Foo',
    description: 'Bar',
    model: 'test'
  },
  test2: {
    type: 'file',
    title: 'Foo',
    description: 'Bar'
  },
  test3: {
    type: 'image',
    title: 'Foo',
    description: 'Bar'
  },
  test4: {
    type: 'postaladdress',
    title: 'Adresse',
    description: 'Bar'
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="inbox" :width="1000">
      <UDashboardNavbar title="Inbox"> </UDashboardNavbar>

      <!-- ~/components/inbox/InboxList.vue -->
      <FormContainer v-model="data" :fields="fields"></FormContainer>
    </UDashboardPanel>
    <UDashboardPanel id="inbox2" :width="300">
      {{ data }}
    </UDashboardPanel>
  </UDashboardPage>
</template>
