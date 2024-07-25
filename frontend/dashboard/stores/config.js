export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      serverNeedsRestart: false
    }
  },

  actions: {
    async refresh () {
      const auth = useAuthStore()
      if (auth.hasRole('$developer')) {
        const api = useApi()
        this.serverNeedsRestart =
          (await api.get('/dashboard/config/serverNeedsRestart')).value ?? false
      }
    }
  }
})
