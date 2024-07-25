<script setup>
const { t } = useI18n({ useScope: 'global' })
useHead({
  title: t('Models | Developer')
})
const router = useRouter()

const columns = [
  {
    key: 'name',
    label: t('Name')
  },
  { key: 'actions', class: 'w-32 text-right' }
]

const items = row => [
  [
    {
      label: t('Edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => router.push(`/developer/models/${row.name}/edit`)
    },
    {
      label: t('Delete'),
      icon: 'i-heroicons-trash-20-solid',
      click: () => console.log('Delete', row.id)
    }
  ]
]

const loading = ref(true)
const models = ref([])
const api = useApi()
const form = ref()
const config = useConfigStore()

async function createNewModel () {
  const data = await form.value.fill(t('Create a new model'), {
    name: {
      title: t('Name'),
      type: 'text',
      regex: models.value.length
        ? `^(?!${models.value
            .map(model => `${model.name}$`)
            .join('|')})[a-z-]+$`
        : '^[a-z-]+$'
    }
  })

  await api.put(`/models/${data.name}`, {
    conf: {},
    relations: [],
    authorizations: {
      enabled: false,
      read: { allow: true, roles: [] },
      write: { allow: true, roles: [] }
    },
    search: {
      enabled: false,
      method: 'regex',
      fields: [],
      js: ''
    },
    cached: false,
    nameField: '',
    listFields: []
  })

  models.value = await api.get('/models')
  await config.refresh()
}

onMounted(async () => {
  models.value = await api.get('/models')
  loading.value = false
})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="$t('Models')" />

      <div class="md:grow md:overflow-auto p-4">
        <UTable
          v-model="selected"
          :rows="models"
          :columns="columns"
          :loading="loading"
        >
          <template #loading-state>
            <div class="flex items-center justify-center h-32">
              <i class="loader --6" />
            </div>
          </template>

          <template #actions-data="{ row }">
            <div class="text-right">
              <UDropdown :items="items(row)">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal-20-solid"
                />
              </UDropdown>
            </div>
          </template>

          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-6 gap-3">
              <span class="italic text-sm">{{ $t('No model yet') }}</span>
              <UButton
                icon="i-heroicons-document-plus"
                @click="createNewModel"
                :label="$t('Create')"
              />
            </div>
          </template>

          <template #actions-header>
            <UButton icon="i-heroicons-document-plus" @click="createNewModel">{{
              $t('Create')
            }}</UButton>
          </template>
        </UTable>
      </div>

      <FormModal ref="form" />
    </UDashboardPanel>
  </UDashboardPage>
</template>
