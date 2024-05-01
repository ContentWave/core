<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

const model = defineModel()

const fields = ref([])

const types = {
  boolean: {
    title: t('Boolean'),
    description: t('True or false value'),
    icon: 'i-carbon-boolean',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false
  },
  date: {
    title: t('Date'),
    description: t('A date, without time'),
    icon: 'i-material-symbols-calendar-month',
    withDefault: false,
    withMultiple: false,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false
  },
  datetime: {
    title: t('Datetime'),
    description: t('A date, with time'),
    icon: 'i-material-symbols-calendar-clock-rounded',
    withDefault: false,
    withMultiple: false,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false
  },
  duration: {
    title: t('Duration'),
    description: t('A duration'),
    icon: 'i-game-icons-duration',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false
  },
  email: {
    title: t('Email'),
    description: t('An email address'),
    icon: 'i-material-symbols-alternate-email',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  },
  enum: {
    title: t('Enum'),
    description: t('A string field, with a fixed list of possible values'),
    icon: 'i-codicon-symbol-enum',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: true,
    withImage: false
  },
  file: {
    title: t('File'),
    description: t('A file, automatically uploaded'),
    icon: 'i-material-symbols-attach-file',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  },
  html: {
    title: t('HTML'),
    description: t('A HTML text field, with automatic WYSIWYG editor'),
    icon: 'i-carbon-html',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false,
    withHtml: true
  },
  image: {
    title: t('Image'),
    description: t('An image, automatically resized and uploaded'),
    icon: 'i-material-symbols-imagesmode-rounded',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: true
  },
  integer: {
    title: t('Integer'),
    description: t('A number, without decimals'),
    icon: 'i-carbon-string-integer',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  },
  number: {
    title: t('Number'),
    description: t('A number, possibly with decimals'),
    icon: 'i-ic-baseline-numbers',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  },
  phone: {
    title: t('Phone'),
    description: t(
      'A phone number, automatically formatted as international number'
    ),
    icon: 'i-material-symbols-call-sharp',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false,
    withDefaultCountry: true
  },
  postaladdress: {
    title: t('Postal address'),
    description: t(
      'A complete postal address, automatically geocoded and geographically searchable'
    ),
    icon: 'i-map-postal-code-prefix',
    withDefault: false,
    withMultiple: false,
    withNullable: false,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false,
    withGeocode: true
  },
  ref: {
    title: t('Reference'),
    description: t('A reference to another document in another collection'),
    icon: 'i-material-symbols-quick-reference-all-outline',
    withDefault: false,
    withMultiple: true,
    withNullable: false,
    withRequired: true,
    withIndex: true,
    withPopulate: true,
    withUnique: true,
    withValues: false,
    withImage: false,
    withModel: true
  },
  text: {
    title: t('Text'),
    description: t('A text field'),
    icon: 'i-material-symbols-format-color-text',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false,
    withText: true
  },
  time: {
    title: t('Time'),
    description: t('A time component, without date'),
    icon: 'i-tabler-clock-hour-2-filled',
    withDefault: false,
    withMultiple: false,
    withNullable: false,
    withRequired: false,
    withIndex: false,
    withPopulate: false,
    withUnique: false,
    withValues: false,
    withImage: false
  },
  url: {
    title: t('URL'),
    description: t('A valid URL'),
    icon: 'i-material-symbols-http',
    withDefault: true,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  },
  uuid: {
    title: t('Date'),
    description: t('A date, without time'),
    icon: 'i-material-symbols-calendar-month',
    withDefault: false,
    withMultiple: true,
    withNullable: true,
    withRequired: true,
    withIndex: true,
    withPopulate: false,
    withUnique: true,
    withValues: false,
    withImage: false
  }
}
const typesArray = Object.entries(types).map(([key, conf]) => ({
  key,
  ...conf
}))

const validator = computed(() => {
  return useAjv(
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          not: {
            enum: [...fields.value.map(o => o.key), '']
          },
          pattern: '^[a-z][a-z0-9\_]+$'
        },
        type: {
          not: {
            type: 'null'
          }
        }
      }
    },
    locale.value
  )
})

const adding = ref(false)
const addForm = reactive({
  name: '',
  type: null
})

function add () {
  addForm.name = ''
  addForm.type = null
  adding.value = true
}

function doAdd () {
  adding.value = false
  fields.value.push({
    key: addForm.name,
    conf: {
      type: addForm.type.key
    }
  })
}

async function validate (state) {
  if (!validator) return []
  const errors = validator.value(state)
  return errors.map(error => ({
    path: error.instancePath.substring(1).replace(/\//g, '.'),
    message: error.message ?? t('This value is invalid.')
  }))
}

watch(
  fields,
  () => {
    console.log(JSON.stringify(model.value))
    Object.assign(
      model.value,
      JSON.parse(
        JSON.stringify(
          Object.fromEntries(fields.value.map(o => [o.key, o.conf]))
        )
      )
    )
    console.log(JSON.stringify(model.value))
  },
  { deep: true }
)

onMounted(() => {
  fields.value = Object.entries(model.value ?? {}).map(([key, conf]) => ({
    key,
    conf
  }))
})
</script>

<template>
  <div class="orm-editor">
    <OrmField
      v-for="(conf, idx) in fields"
      :key="idx"
      :name="fields[idx].key"
      v-model="fields[idx].conf"
      :conf="types[conf.conf.type]"
      @delete="fields.splice(idx)"
    />

    <UButton
      color="primary"
      icon="i-material-symbols-add-circle-outline-rounded"
      @click="add"
      >{{ $t('Add') }}</UButton
    >
  </div>
  <UModal v-model="adding" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800'
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ $t('Adding a new field') }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="adding = false"
          />
        </div>
      </template>

      <UForm
        :validate="validate"
        :state="addForm"
        @submit="doAdd"
        class="flex flex-col gap-4"
      >
        <UFormGroup :label="$t('Name')" name="name">
          <UInput v-model="addForm.name" />
        </UFormGroup>

        <UFormGroup :label="$t('Field type')" name="type">
          <USelectMenu
            v-model="addForm.type"
            :options="typesArray"
            option-attribute="title"
            by="key"
          >
            <template #leading>
              <UIcon
                v-if="addForm.type"
                :name="addForm.type.icon"
                class="w-5 h-5"
              />
            </template>
          </USelectMenu>
          <div v-if="addForm.type" class="mt-2 text-sm opacity-50">
            {{ addForm.type.description }}
          </div>
          <UButton
            type="submit"
            class="mt-4"
            icon="i-material-symbols-add-circle-outline-rounded"
          >
            {{ $t('Add') }}
          </UButton>
        </UFormGroup>
      </UForm>
    </UCard>
  </UModal>
</template>
