export const useChallengeStore = defineStore('challenge', {
  state: () => {
    return {
      authorized: false,
      readyToRedirect: false,
      needsTotp: false,
      needsValidation: false,
      needsOneTimeCode: false,
      haveTotp: false,
      totpType: 'google',
      avoidFido: false,
      avoidTotp: false
    }
  },

  actions: {
    ignoreFido () {
      this.avoidFido = true
    },
    ignoreTotp () {
      this.avoidTotp = true
    },
    async update () {
      try {
        const route = useRoute()
        if (route.query.challenge_id === undefined) return
        const api = useApi()
        const state = await api.get(
          `/auth/challenges/${route.query.challenge_id}/state`
        )
        await this.updateFromApi(state)
      } catch {
        useRouter().push(
          `/error?msg=${encodeURIComponent(
            'Authorization challenge is expired, please try again.'
          )}`
        )
      }
    },
    async updateFromApi (state) {
      try {
        for (let key in state) this[key] = state[key]
        await this.handleNewData()
      } catch {}
    },
    async handleNewData () {
      try {
        const route = useRoute()
        const router = useRouter()
        const auth = useAuthStore()
        const api = useApi()
        if (this.needsValidation) {
          router.push(
            `/validation-required?challenge_id=${route.query.challenge_id}`
          )
        } else if (this.needsOneTimeCode) {
          router.push(`/one-time-code?challenge_id=${route.query.challenge_id}`)
        } else if (this.needsTotp) {
          router.push(`/totp?challenge_id=${route.query.challenge_id}`)
        } else if (this.readyToRedirect) {
          if (!this.haveTotp && auth.conf.totp && !this.avoidTotp) {
            router.push(
              `/propose-totp?challenge_id=${route.query.challenge_id}`
            )
          } else if (canSetupFido() && auth.conf.fido2 && !this.avoidFido) {
            router.push(
              `/propose-fido?challenge_id=${route.query.challenge_id}`
            )
          } else {
            const url = await api.get(
              `/auth/challenges/${route.query.challenge_id}/redirect-url`
            )
            window.location.href = url.redirectUrl
          }
        }
      } catch {}
    }
  }
})
