<script setup lang="ts">
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const appConfig = useAppConfig()

const authStore = useAuthStore()

const links = [
  {
    id: 'home',
    label: t('Home'),
    icon: 'i-heroicons-home',
    to: '/',
    tooltip: {
      text: t('Home'),
      shortcuts: ['G', 'H']
    }
  }
]

const footerLinks: any[] = []

if (authStore.hasRole('$developer')) {
  footerLinks.push({
    label: t('Models'),
    icon: 'i-material-symbols-database',
    to: '/developer/models'
  })
  footerLinks.push({
    label: t('Functions'),
    icon: 'i-material-symbols-function',
    to: '/developer/functions'
  })
  footerLinks.push({
    label: t('Plugins'),
    icon: 'i-clarity-plugin-solid',
    to: '/developer/plugins'
  })
  footerLinks.push({
    label: t('Settings'),
    icon: 'i-material-symbols-settings',
    to: '/developer/settings'
  })
}

const groups = [
  {
    key: 'links',
    label: t('Go to'),
    commands: [
      ...links.map(link => ({
        ...link,
        shortcuts: link.tooltip?.shortcuts
      })),
      ...footerLinks.map(link => ({
        ...link,
        shortcuts: link.tooltip?.shortcuts
      }))
    ]
  }
]

const ui = useUiStore()
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <div class="flex items-center justify-center">
            <div
              class="rounded-full w-8 h-8"
              :style="{
                background: `${ui.logoBackground} url(${ui.logo}) no-repeat center center`,
                backgroundSize: ui.logoSize
              }"
            ></div>
            <div class="grow ml-2 text-sm font-bold">
              {{ ui.title }}
            </div>
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton :label="$t('Search ...')" />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <div class="flex-1" />

        <UDivider :label="$t('Developer')" v-if="footerLinks.length" />
        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
