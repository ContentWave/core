<script setup>
const props = defineProps({ label: String })
const model = defineModel()
const enabled = computed({
  get () {
    return model.value !== undefined
  },
  set (newValue) {
    model.value = newValue ? null : undefined
  }
})
</script>

<template>
  <UFormGroup>
    <template #label>
      <UCheckbox v-model="enabled" :label="label" />
    </template>
    <slot v-if="enabled" />
  </UFormGroup>
</template>
