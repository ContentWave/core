<script setup>
const { locale } = useI18n({ useScope: 'global' })

import FormBoolean from '../Form/Boolean.vue'
import FormUrl from '../Form/Url.vue'
import FormDate from '../Form/Date.vue'
import FormDatetime from '../Form/Datetime.vue'
import FormDuration from '../Form/Duration.vue'
import FormEmail from '../Form/Email.vue'
import FormEnum from '../Form/Enum.vue'
import FormFile from '../Form/File.vue'
import FormImage from '../Form/Image.vue'
import FormInteger from '../Form/Integer.vue'
import FormNumber from '../Form/Number.vue'
import FormPhone from '../Form/Phone.vue'
import FormPostaladdress from '../Form/Postaladdress.vue'
import FormRef from '../Form/Ref.vue'
import FormText from '../Form/Text.vue'
import FormTime from '../Form/Time.vue'
import FormUuid from '../Form/Uuid.vue'
import FormHtml from '../Form/Html.vue'

const types = {
  date: FormDate,
  datetime: FormDatetime,
  duration: FormDuration,
  email: FormEmail,
  enum: FormEnum,
  file: FormFile,
  image: FormImage,
  integer: FormInteger,
  number: FormNumber,
  phone: FormPhone,
  postaladdress: FormPostaladdress,
  ref: FormRef,
  text: FormText,
  time: FormTime,
  uuid: FormUuid,
  boolean: FormBoolean,
  url: FormUrl,
  html: FormHtml
}

const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const emit = defineEmits(['delete'])
const api = useApi()
const editing = ref(false)
const edited = reactive({})
const deleting = ref(false)

const countries = computed(() => {
  return Object.entries(useCountries(locale.value)).map(([code, name]) => ({
    label: name,
    value: code
  }))
})

const models = ref([])

onMounted(async () => {
  if (props.conf.withModel) models.value = await api.get(`/dashboard/models`)
})

function edit () {
  Object.assign(edited, model.value ?? {})
  if (props.conf.withValues && edited.values === undefined) edited.values = []
  editing.value = true
}

function save () {
  model.value = { ...edited }
  editing.value = false
}

function doDelete () {
  deleting.value = false
  emit('delete')
}
</script>

<template>
  <div
    class="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-center rounded-md mb-4"
  >
    <div class="w-8 text-center">
      <UIcon :name="conf.icon" class="text-primary"></UIcon>
    </div>
    <div class="font-bold ml-2">{{ name }}</div>
    <div class="grow text-sm text-gray-500 ml-4">
      {{ model?.title }}
    </div>
    <UButton
      class="select-none"
      size="sm"
      variant="ghost"
      color="primary"
      icon="i-heroicons-pencil-square"
      @click="edit"
      >{{ $t('Edit') }}</UButton
    >
    <UButton
      class="select-none"
      size="sm"
      variant="ghost"
      color="red"
      icon="i-material-symbols-delete-outline"
      @click="deleting = true"
      >{{ $t('Delete') }}</UButton
    >
  </div>

  <UModal v-model="editing" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }"
      v-if="edited"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ $t('Edit {key}', { key: name }) }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="editing = false"
          />
        </div>
      </template>

      <UForm :state="edited" class="flex flex-col gap-4">
        <UFormGroup :label="$t('Title')">
          <UInput v-model="edited.title" />
        </UFormGroup>
        <UFormGroup :label="$t('Description')">
          <UInput v-model="edited.description" />
        </UFormGroup>
        <UFormGroup :label="$t('Multiple')" v-if="conf.withMultiple">
          <UCheckbox
            v-model="edited.multiple"
            :label="$t('This field will contain multiple values')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Nullable')" v-if="conf.withNullable">
          <UCheckbox
            v-model="edited.nullable"
            :label="$t('This field can be null')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Required')" v-if="conf.withRequired">
          <UCheckbox
            v-model="edited.required"
            :label="$t('This field must be filled')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Indexed')" v-if="conf.withIndex">
          <UCheckbox
            v-model="edited.index"
            :label="
              $t(
                'This field will be indexed and search performance will be increased'
              )
            "
          />
        </UFormGroup>
        <UFormGroup :label="$t('Populate')" v-if="conf.withPopulate">
          <UCheckbox
            v-model="edited.populate"
            :label="
              $t(
                'Instead of receiving a document ID, you will receive the referenced document'
              )
            "
          />
        </UFormGroup>
        <UFormGroup :label="$t('Unique')" v-if="conf.withUnique">
          <UCheckbox
            v-model="edited.unique"
            :label="$t('The value must be unique in the collection')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Values')" v-if="conf.withValues">
          <div
            v-for="(value, idx) in edited.values"
            :key="idx"
            class="flex items-center gap-2 mb-4"
          >
            <div class="flex-1">
              <UInput
                v-model="edited.values[idx].label"
                :placeholder="$t('Label')"
              />
            </div>
            <div class="flex-1">
              <UInput
                v-model="edited.values[idx].value"
                :placeholder="$t('Value')"
              />
            </div>
            <div class="shrink-0">
              <UButton
                icon="i-heroicons-trash"
                size="sm"
                color="red"
                square
                variant="outline"
                @click="edited.values.splice(idx, 1)"
              />
            </div>
          </div>
          <UButton
            variant="outline"
            size="xs"
            @click="edited.values.push({ label: '', value: '' })"
          >
            {{ $t('Add a value') }}
          </UButton>
        </UFormGroup>
        <UFormGroup :label="$t('Resize')" v-if="conf.withImage">
          <UCheckbox
            v-model="edited.resize"
            :label="$t('Automatically resize image on upload')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Crop')" v-if="conf.withImage && edited.resize">
          <UCheckbox
            v-model="edited.crop"
            :label="$t('Allow to crop image if too big')"
          />
        </UFormGroup>
        <UFormGroup
          :label="$t('Max height')"
          v-if="conf.withImage && edited.resize"
        >
          <UInput v-model.number="edited.maxHeight" type="number">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">px</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup
          :label="$t('Max width')"
          v-if="conf.withImage && edited.resize"
        >
          <UInput v-model.number="edited.maxWidth" type="number">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">px</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup
          :label="$t('Default country to format number')"
          v-if="conf.withDefaultCountry"
        >
          <USelect v-model="edited.defaultCountry" :options="countries">
          </USelect>
        </UFormGroup>
        <UFormGroup
          :label="$t('Automatically geocode address')"
          v-if="conf.withGeocode"
        >
          <UCheckbox
            v-model="edited.geocode"
            :label="$t('The address will be geocoded when updated')"
          />
        </UFormGroup>
        <UFormGroup :label="$t('Model')" v-if="conf.withModel">
          <USelect v-model="edited.model" :options="models"> </USelect>
        </UFormGroup>
        <OrmOptionalFormGroup
          :label="$t('Default value')"
          v-model="edited.default"
          v-if="conf.withDefault"
        >
          <component
            :is="types[edited.type]"
            :conf="edited"
            v-model="edited.default"
            :name="name"
          />
        </OrmOptionalFormGroup>

        <div>
          <UButton @click="save">
            {{ $t('Save updates') }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>

  <UModal v-model="deleting" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }"
      v-if="edited"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ $t('Delete {key} ?', { key: name }) }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="deleting = false"
          />
        </div>
      </template>

      <UButton @click="doDelete" color="red">
        {{ $t('Yes, delete') }}
      </UButton>
      <UButton @click="deleting = false" variant="outline" class="ml-4">
        {{ $t('Cancel') }}
      </UButton>
    </UCard>
  </UModal>
</template>
