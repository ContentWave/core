export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      conf: {
        password: false,
        fido2: false,
        totp: false,
        magicLink: false,
        oneTimeCode: false,
        invite: false,
        validation: false,
        register: false,
        defaultRedirectUrl: ''
      },
      plugins: []
    }
  },

  actions: {
    async init () {
      const api = useApi()
      const conf = await api.get('/auth/config')
      this.conf = conf.conf
      this.plugins = conf.plugins
    }
  }
})
