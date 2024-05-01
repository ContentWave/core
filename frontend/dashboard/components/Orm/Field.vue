<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const emit = defineEmits(['delete'])
const editing = ref(false)
const edited = reactive({})
const deleting = ref(false)

function edit () {
  Object.assign(edited, model.value)
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
      size="sm"
      variant="ghost"
      color="primary"
      icon="i-heroicons-pencil-square"
      @click="edit"
      >{{ $t('Edit') }}</UButton
    >
    <UButton
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
