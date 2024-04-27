<script setup lang="ts">
const { locale } = useI18n({ useScope: 'global' })
const colorMode = useColorMode()

const color = computed(() => (colorMode.value === 'dark' ? '#111827' : 'white'))

useHead({
  titleTemplate: (title?: string) =>
    title ? `${title} | ${ui.title}` : ui.title,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: locale
  }
})
const ui = useUiStore()
const auth = useAuthStore()
const loaded = ref(false)
onMounted(async () => {
  const route = useRoute()
  await ui.init()
  await auth.init()
  if (!auth.loggedIn) {
    if (route.path === auth.callbackUrl) {
      auth.resolveCode()
    } else {
      auth.login()
    }
  }
  loaded.value = true
})
</script>

<template>
  <div v-if="auth.userdata !== null && loaded">
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
  <div class="h-screen flex items-center justify-center overlay" v-else>
    <div class="gradient"></div>
    <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
      <div class="flex items-center justify-center opacity-30">
        <div class="lds-grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style lang="scss" scoped>
.gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgb(var(--color-primary-500) / 0.25) 0,
    #fff 100%
  );
}

.dark {
  .gradient {
    background: radial-gradient(
      50% 50% at 50% 50%,
      rgb(var(--color-primary-400) / 0.1) 0,
      rgb(var(--color-gray-950)) 100%
    );
  }
}

.overlay {
  background-size: 100px 100px;
  background-image: linear-gradient(
      to right,
      rgb(var(--color-gray-200)) 0.5px,
      transparent 0.5px
    ),
    linear-gradient(
      to bottom,
      rgb(var(--color-gray-200)) 0.5px,
      transparent 0.5px
    );
}
.dark {
  .overlay {
    background-image: linear-gradient(
        to right,
        rgb(var(--color-gray-900)) 0.5px,
        transparent 0.5px
      ),
      linear-gradient(
        to bottom,
        rgb(var(--color-gray-900)) 0.5px,
        transparent 0.5px
      );
  }
}

.lds-grid,
.lds-grid div {
  box-sizing: border-box;
}
.lds-grid {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-grid div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: currentColor;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
