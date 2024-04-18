<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-950'
  }
})
const appConfig = useAppConfig()
const loading = ref(true)
const ui = useUiStore()
const auth = useAuthStore()
const challenge = useChallengeStore()

onMounted(async () => {
  await Promise.all([ui.init(), auth.init()])
  await challenge.update()
  appConfig.ui.primary = ui.color
  loading.value = false
})
</script>

<template>
  <div class="h-screen flex items-center justify-center overlay">
    <div class="gradient"></div>
    <UCard
      v-if="loading"
      class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
    >
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
    <template v-else>
      <slot />
    </template>
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
