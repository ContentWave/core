export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      color: '',
      description: '',
      logo: '',
      logoBackground: '',
      logoSize: '',
      title: 'ContentWave Auth'
    }
  },

  actions: {
    async init () {
      const api = useApi()
      const conf = await api.get('/ui/config')
      this.color = conf.color
      this.description = conf.description
      this.logo = conf.logo
      this.logoBackground = conf.logoBackground
      this.logoSize = conf.logoSize
      this.title = conf.title
    }
  }
})
