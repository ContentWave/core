<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()

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
      },
      {
        label: 'Help & Support',
        icon: 'i-heroicons-question-mark-circle',
        shortcuts: ['?'],
        click: () => (isHelpSlideoverOpen.value = true)
      }
    ],
    auth.hasRole('$developer')
      ? [
          {
            label: 'Documentation',
            icon: 'i-heroicons-book-open',
            to: 'https://ui.nuxt.com/pro/getting-started',
            target: '_blank'
          }
        ]
      : null,
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
