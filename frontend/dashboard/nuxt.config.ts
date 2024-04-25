// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-icon'
  ],
  ui: {
    icons: [],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  css: ['@vuepic/vue-datepicker/dist/main.css', 'leaflet/dist/leaflet.css'],
  i18n: {
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'fr',
        name: 'Français'
      }
    ]
  },
  ssr: false,
  devtools: {
    enabled: true
  },
  app: {
    baseURL: '/dashboard'
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL ?? ''
    }
  },
  devServer: {
    port: 3000
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  }
})
