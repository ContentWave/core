export const useChallengeStore = defineStore('challenge', {
  state: () => {
    return {
      authorized: false,
      readyToRedirect: false,
      needsTotp: false,
      needsValidation: false,
      needsOneTimeCode: false,
      haveTotp: false,
      totpType: false
    }
  },

  actions: {
    async update () {
      try {
        const route = useRoute()
        if (route.query.challenge_id === undefined) return
        const api = useApi()
        const state = await api.get(
          `/auth/challenges/${route.query.challenge_id}/state`
        )
        await this.updateFromApi(state)
      } catch {}
    },
    async updateFromApi (state) {
      try {
        for (let key in state) this[key] = state[key]

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
          if (!this.haveTotp && auth.conf.totp) {
            router.push(
              `/propose-totp?challenge_id=${route.query.challenge_id}`
            )
          } else if (canSetupFido() && auth.conf.fido2) {
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
