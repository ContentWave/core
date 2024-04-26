<script setup lang="ts">
const data = reactive({
  file: 'data:text/html;base64,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E'
})
const fields = {
  file: {
    type: 'file',
    title: 'Fichier'
  },
  image: {
    type: 'image',
    title: 'Image',
    description: 'Wesh'
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
