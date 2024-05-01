<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const config = useRuntimeConfig()
const auth = await useAuthStore()

const items = computed(() =>
  [
    [
      {
        slot: 'account',
        label: '',
        disabled: true
      }
    ],
    [
      {
        label: t('My profile'),
        icon: 'i-heroicons-cog-8-tooth',
        to: '/profile'
      }
    ],
    auth.hasRole('$developer')
      ? [
          {
            label: t('API documentation'),
            icon: 'i-heroicons-book-open',
            to: `${config.public.apiUrl}/v1`,
            target: '_blank'
          }
        ]
      : null,
    [
      {
        label: isDark.value
          ? t('Switch to light mode')
          : t('Switch to dark mode'),
        icon: isDark.value
          ? 'i-material-symbols-light-mode'
          : 'i-material-symbols-dark-mode',
        click() {
          isDark.value = !isDark.value
        }
      }
    ],
    [
      {
        label: t('Sign out'),
        icon: 'i-heroicons-arrow-left-on-rectangle',
        click: () => {
          auth.logout()
        }
      }
    ]
  ].filter((a: any) => a !== null)
)
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="auth.user.firstname"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar :src="auth.user.avatar" size="2xs" />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
          {{ $t('Signed in as') }}
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ auth.user.email }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
