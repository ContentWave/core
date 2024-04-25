<script setup>
import FormDate from './Date'
import FormDatetime from './Datetime'
import FormDuration from './Duration'
import FormEmail from './Email'
import FormEnum from './Enum'
import FormFile from './File'
import FormImage from './Image'
import FormInteger from './Integer'
import FormNumber from './Number'
import FormPhone from './Phone'
import FormPostaladdress from './Postaladdress'
import FormRef from './Ref'
import FormText from './Text'
import FormTime from './Time'
import FormUuid from './Uuid'

const props = defineProps({
  conf: {},
  name: { type: String }
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
  uuid: FormUuid
}

function tryToDelete (idx) {
  model.value.splice(idx, 1)
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
})
</script>

<template>
  <UFormGroup
    :label="conf.title"
    :hint="conf.description"
    :name="name"
    v-if="!conf.multiple"
  >
    <component
      :is="types[conf.type]"
      v-model="model"
      :conf="conf"
      :name="name"
    />
  </UFormGroup>
  <UFormGroup :label="conf.title" :hint="conf.description" v-else>
    <div v-for="(item, idx) in model" :key="idx">
      <div v-if="idx > 0" class="my-4 bg-gray-300 dark:bg-gray-800 h-px"></div>
      <div class="flex items-start justify-start">
        <div class="grow">
          <UFormGroup :name="`${name}.${idx}`">
            <component
              :is="types[conf.type]"
              v-model="model[idx]"
              :conf="conf"
              :name="name"
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
