<script setup>
const { locale } = useI18n({ useScope: 'global' })
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)
const searchQuery = ref('')
const loadingSearch = ref(false)

async function search (q) {
  loadingSearch.value = true
  const choices = await $fetch(
    'https://nominatim.openstreetmap.org/search?format=json&q=' +
      encodeURIComponent(q)
  )
  loadingSearch.value = false
  return choices.map(c => ({
    id: c.osm_type.substring(0, 1).toUpperCase() + c.osm_id,
    name: c.display_name
  }))
}

const countries = computed(() => {
  return Object.entries(useCountries(locale.value)).map(([code, name]) => ({
    label: name,
    value: code
  }))
})

watch(searchQuery, async ({ id }) => {
  try {
    const [details] = await $fetch(
      `https://nominatim.openstreetmap.org/lookup?osm_ids=${id}&format=json`
    )
    model.value.country = details.address.country_code.toUpperCase()
    model.value.name_line = ''
    model.value.organisation_name = details.address.amenity ?? ''
    model.value.administrative_area = details.address.state ?? ''
    model.value.locality =
      details.address.village ??
      details.address.town ??
      details.address.city ??
      details.address.municipality
    model.value.postal_code = details.address.postcode ?? ''
    model.value.thoroughfare = [
      details.address.house_name ?? details.address.house_number ?? '',
      details.address.road ?? ''
    ]
      .filter(a => a.length)
      .join(', ')
    model.value.premise = ''
    model.value.location.lat = +details.lat
    model.value.location.lng = +details.lon
  } catch {
    console.log(`Error when fetching place details, for OSM ID: ${id}`)
  }
})

const filled = computed(() => {
  return (
    inSetup.value === false &&
    (model.value.country !== '' ||
      model.value.name_line !== '' ||
      model.value.organisation_name !== '' ||
      model.value.administrative_area !== '' ||
      model.value.locality !== '' ||
      model.value.postal_code !== '' ||
      model.value.thoroughfare !== '' ||
      model.value.premise !== '')
  )
})

onMounted(() => {
  if (!model.value)
    model.value = {
      country: '',
      name_line: '',
      organisation_name: '',
      administrative_area: '',
      locality: '',
      postal_code: '',
      thoroughfare: '',
      premise: '',
      location: {
        lat: null,
        lng: null
      }
    }
  inSetup.value = false
})
</script>

<template>
  <div v-if="!inSetup">
    <UInputMenu
      v-model="searchQuery"
      by="id"
      option-attribute="name"
      :search="search"
      :loading="loadingSearch"
      icon="i-heroicons-magnifying-glass-20-solid"
      :placeholder="$t('Search a postal address ...')"
    >
    </UInputMenu>
    <div v-if="filled" class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UInput
          v-model="model.name_line"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Name')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.organisation_name"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Company name')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.thoroughfare"
          class="col-span-1 md:col-span-2"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Street address')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.premise"
          class="col-span-1 md:col-span-2"
          :placeholder="$t('Apartment, Suite, Box number, etc.')"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Premise')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.postal_code"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Postal code')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.locality"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('City')
            }}</span>
          </template>
        </UInput>
        <UInput
          v-model="model.administrative_area"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('State')
            }}</span>
          </template>
        </UInput>
        <USelect
          v-model="model.country"
          :options="countries"
          :ui="{ leading: { padding: { sm: 'ps-32' } } }"
        >
          <template #leading>
            <span class="text-gray-500 dark:text-gray-400 text-xs">{{
              $t('Country')
            }}</span>
          </template>
        </USelect>
      </div>
      <form-map v-model="model.location" class="rounded-md mt-4" />
    </div>
  </div>
</template>
