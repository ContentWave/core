<script setup>
import { v4 as uuid } from 'uuid'

const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)

onMounted(() => {
  if (!model.value) model.value = ''
  inSetup.value = false
})
</script>

<template>
  <div class="flex items-center justify-center">
    <UInput v-model="model" v-if="!inSetup" class="grow" />
    <UButton
      @click="model = uuid()"
      variant="outline"
      color="primary"
      class="shrink-0 ml-2"
      >{{ $t('Generate') }}</UButton
    >
  </div>
</template>
