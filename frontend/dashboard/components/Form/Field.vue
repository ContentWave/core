<script setup>
const { locale } = useI18n({ useScope: 'global' })

import FormBoolean from './Boolean.vue'
import FormUrl from './Url.vue'
import FormDate from './Date.vue'
import FormDatetime from './Datetime.vue'
import FormDuration from './Duration.vue'
import FormEmail from './Email.vue'
import FormEnum from './Enum.vue'
import FormFile from './File.vue'
import FormImage from './Image.vue'
import FormInteger from './Integer.vue'
import FormNumber from './Number.vue'
import FormPhone from './Phone.vue'
import FormPostaladdress from './Postaladdress.vue'
import FormRef from './Ref.vue'
import FormText from './Text.vue'
import FormTime from './Time.vue'
import FormUuid from './Uuid.vue'
import FormHtml from './Html.vue'

function i18nText (text) {
  if (typeof text === 'string') return text
  return text[locale.value] ?? text[Object.keys(text)[0]] ?? ''
}

const props = defineProps({
  conf: {},
  name: { type: String },
  uploadFiles: { type: Boolean, default: false }
})
const model = defineModel()
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
const isReady = ref(false)

function tryToDelete (idx) {
  model.value.splice(idx, 1)
}

function moveItem (idx, direction) {
  const temp = model.value[idx]
  model.value[idx] = model.value[idx + direction]
  model.value[idx + direction] = temp
}

onMounted(() => {
  if (props.conf.multiple && !model.value) model.value = []
  else if (props.conf.default !== undefined) model.value = props.conf.default
  if (props.conf.multiple) {
    if (props.conf.minItems !== undefined)
      while (model.value.length < props.conf.minItems)
        model.value.push(props.conf.default ?? null)
    if (props.conf.maxItems !== undefined)
      while (model.value.length > props.conf.maxItems)
        model.value.splice(model.value.length - 1, 1)
  }
  isReady.value = true
})
</script>

<template>
  <UFormGroup
    :label="conf.title"
    :hint="conf.description"
    :name="name"
    v-if="!conf.multiple && isReady"
  >
    <component
      :is="types[conf.type]"
      v-model="model"
      :conf="conf"
      :name="name"
      :uploadFiles="uploadFiles"
    />
  </UFormGroup>
  <UFormGroup
    :label="i18nText(conf.title)"
    :hint="i18nText(conf.description ?? '')"
    v-else-if="isReady"
  >
    <div v-for="(item, idx) in model" :key="idx">
      <div v-if="idx > 0" class="my-4 bg-gray-300 dark:bg-gray-800 h-px"></div>
      <div class="flex items-start justify-start">
        <div class="shrink-0 mr-2 w-8" v-if="model.length > 1">
          <UButton
            icon="i-heroicons-arrow-up"
            size="sm"
            color="gray"
            square
            variant="ghost"
            @click="moveItem(idx, -1)"
            v-if="idx !== 0"
          />
        </div>
        <div class="shrink-0 mr-2 w-8" v-if="model.length > 1">
          <UButton
            icon="i-heroicons-arrow-down"
            size="sm"
            color="gray"
            square
            variant="ghost"
            @click="moveItem(idx, 1)"
            v-if="idx !== model.length - 1"
          />
        </div>
        <div class="grow">
          <UFormGroup :name="`${name}.${idx}`">
            <component
              :is="types[conf.type]"
              v-model="model[idx]"
              :conf="conf"
              :name="name"
              :uploadFiles="uploadFiles"
            />
          </UFormGroup>
        </div>
        <div
          class="shrink-0 ml-2"
          v-if="conf.minItems === undefined || model.length > conf.minItems"
        >
          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            square
            variant="outline"
            @click="tryToDelete(idx)"
          />
        </div>
      </div>
    </div>
    <UButton
      :class="{ 'mt-4': model.length }"
      icon="i-heroicons-plus-solid"
      size="sm"
      color="primary"
      variant="outline"
      :label="$t('Add')"
      :trailing="false"
      @click="model.push(conf.default ?? null)"
      v-if="conf.maxItems === undefined || model.length < conf.maxItems"
    />
  </UFormGroup>
</template>
