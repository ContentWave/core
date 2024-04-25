<script setup>
const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()
const inSetup = ref(true)
const inner = reactive({
  seconds: 0,
  minutes: 0,
  hours: 0,
  days: 0,
  months: 0,
  years: 0
})

watch(
  () => inner,
  () => {
    model.value = useDuration(inner).toISOString()
  },
  {
    deep: true
  }
)
onMounted(() => {
  if (!model.value) model.value = 'P0D'
  const parsed = useDuration(model.value)
  inner.seconds = parsed.seconds()
  inner.minutes = parsed.minutes()
  inner.hours = parsed.hours()
  inner.days = parsed.days()
  inner.months = parsed.months()
  inner.years = parsed.years()
  inSetup.value = false
})
</script>

<template>
  <div class="grid gap-4 grid-cols-3">
    <UInput v-model.number="inner.years">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('year(s)')
        }}</span>
      </template>
    </UInput>
    <UInput v-model.number="inner.months">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('month(s)')
        }}</span>
      </template>
    </UInput>
    <UInput v-model.number="inner.days">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('day(s)')
        }}</span>
      </template>
    </UInput>
    <UInput v-model.number="inner.hours">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('hour(s)')
        }}</span>
      </template>
    </UInput>
    <UInput v-model.number="inner.minutes">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('minute(s)')
        }}</span>
      </template>
    </UInput>
    <UInput v-model.number="inner.seconds">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          $t('second(s)')
        }}</span>
      </template>
    </UInput>
  </div>
</template>
