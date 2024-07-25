<script setup>
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()

useHead({
  title: t('Edit {name} | Models | Developer', { name: route.params.modelName })
})

const loading = ref(true)
const value = ref({})
const lastValue = ref('')
const api = useApi()
const config = useConfigStore()

const tabs = [
  {
    key: 'fields',
    label: t('Fields')
  },
  {
    key: 'admin',
    label: t('Administration')
  },
  {
    key: 'relations',
    label: t('Relations')
  },
  {
    key: 'authorizations',
    label: t('Authorizations')
  },
  {
    key: 'search',
    label: t('Search')
  },
  {
    key: 'settings',
    label: t('Settings')
  }
]

const settingsConf = {
  cached: {
    type: 'boolean',
    title: t('Keep documents in memory cache to enhance performance')
  }
}

const searchConf = computed(() => {
  const ret = {
    enabled: {
      type: 'boolean',
      title: t('Allow users to search data in this collection')
    }
  }
  if (value.value?.search?.enabled) {
    ret.method = {
      type: 'enum',
      title: t('Search method'),
      values: [
        { value: 'regex', label: t('Regex') },
        { value: 'atlassearch', label: t('Mongo Atlas Search') },
        { value: 'memory', label: t('In memory search') },
        { value: 'atlasvectorsearch', label: t('Mongo Atlas Vector Search') },
        { value: 'rag', label: t('Local RAG') },
        { value: 'js', label: t('Local search') }
      ]
    }

    ret.fields = {
      type: 'enum',
      title: t('Searchable fields'),
      multiple: true,
      values: Object.keys(value.value.conf).map(name => ({
        label: name,
        value: name
      }))
    }
  }

  return ret
})

const adminConf = computed(() => {
  const ret = {
    listFields: {
      type: 'enum',
      title: t('Fields to display in the list'),
      multiple: true,
      values: Object.keys(value.value.conf).map(name => ({
        label: name,
        value: name
      }))
    }
  }

  return ret
})

const confKeys = computed(() => {
  return Object.keys(value.value?.conf ?? {})
})

const modified = computed(() => JSON.stringify(value.value) !== lastValue.value)
const saving = ref(false)

async function save () {
  saving.value = true
  await api.put(`/models/${route.params.modelName}`, value.value)
  await config.refresh()
  lastValue.value = JSON.stringify(value.value)
  saving.value = false
}

onMounted(async () => {
  value.value = await api.get(`/models/${route.params.modelName}`)
  lastValue.value = JSON.stringify(value.value)
  loading.value = false
})
</script>

<template>
  <UDashboardPage class="md:h-full md:overflow-hidden">
    <UDashboardPanel grow>
      <UDashboardNavbar :title="route.params.modelName">
        <template #right>
          <UButton :disabled="!modified" :loading="saving" @click="save">
            {{ $t('Save updates') }}
          </UButton>
        </template>
      </UDashboardNavbar>
      <div class="md:grow md:overflow-auto p-4">
        <div v-if="!loading">
          <UTabs :items="tabs" class="w-full">
            <template #item="{ item: tab }">
              <UCard>
                <div v-if="tab.key === 'fields'">
                  <OrmEditor v-model="value.conf" />
                </div>
                <div v-if="tab.key === 'admin'">
                  <FormContainer
                    v-model="value"
                    :fields="adminConf"
                    :allow-submit="false"
                  />
                </div>
                <div v-if="tab.key === 'relations'">Work in progress.</div>
                <div v-if="tab.key === 'authorizations'">Work in progress.</div>
                <div v-else-if="tab.key === 'search'">
                  <FormContainer
                    v-model="value.search"
                    :fields="searchConf"
                    :allow-submit="false"
                  />
                </div>
                <div v-else-if="tab.key === 'settings'">
                  <FormContainer
                    v-model="value"
                    :fields="settingsConf"
                    :allow-submit="false"
                  />
                  <UFormGroup
                    class="mt-4"
                    :label="
                      $t('Field to use to identify a document (usually a name)')
                    "
                  >
                    <USelectMenu
                      v-model="value.nameField"
                      :options="confKeys"
                    />
                  </UFormGroup>
                </div>
              </UCard>
            </template>
          </UTabs>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
