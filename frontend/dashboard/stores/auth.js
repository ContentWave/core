export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      userdata: null,
      accessToken: null,
      refreshToken: null,
      clientId: 'self',
      callbackUrl: '/callback',
      fullCallbackUrl: '/dashboard/callback',
      endpoints: {
        authorization: '/oauth/authorize',
        token: '/oauth/token',
        userInfo: '/api/me',
        logout: null
      },
      refreshTokenMaxAge: 3600 * 24 * 30,
      refresher: null
    }
  },
  getters: {
    loggedIn (state) {
      return !!state.userdata
    },
    user (state) {
      return (
        state.userdata ?? {
          id: null,
          firstname: '',
          lastname: '',
          avatar: '',
          roles: [],
          email: ''
        }
      )
    }
  },
  actions: {
    hasRole (role) {
      return (this.userdata?.roles ?? []).includes(role)
    },
    async init () {
      const config = useRuntimeConfig()
      this.endpoints.authorization = `${
        config.public.apiUrl ?? ''
      }/auth/authorize`
      this.endpoints.token = `${config.public.apiUrl ?? ''}/auth/token`
      this.endpoints.userInfo = `${config.public.apiUrl ?? ''}/auth/me`
      this.endpoints.logout = `${config.public.apiUrl ?? ''}/auth/logout`
      const user = useCookie('contentwave_user')
      this.userdata = user.value
      const accessToken = useCookie('contentwave_access_token')
      this.accessToken = accessToken.value
      const refreshToken = useCookie('contentwave_refresh_token')
      this.refreshToken = refreshToken.value
      if (this.refreshToken && !this.accessToken) await this.refresh()
      if (this.accessToken) await this.setupRefresher()
    },
    generateRandomString () {
      const array = new Uint32Array(56 / 2)
      window.crypto.getRandomValues(array)
      return Array.from(array, this.dec2hex).join('')
    },
    dec2hex (dec) {
      return ('0' + dec.toString(16)).substr(-2)
    },
    sha256 (plain) {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
    },
    base64urlencode (a) {
      let str = ''
      const bytes = new Uint8Array(a)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i])
      }
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    },
    async getChallengeFromVerifier (v) {
      return this.base64urlencode(await this.sha256(v))
    },
    async login () {
      const state = useCookie('contentwave_state')
      state.value = this.generateRandomString()

      // create oauth authorization url
      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: window.location.origin + this.fullCallbackUrl,
        response_type: 'code',
        scope: '',
        state: state.value,
        prompt: ''
      })

      const codeVerifier = useCookie('contentwave_code_verifier')
      codeVerifier.value = this.generateRandomString()

      params.set(
        'code_challenge',
        await this.getChallengeFromVerifier(codeVerifier.value)
      )
      params.set('code_challenge_method', 'S256')

      window.location.href = `${
        this.endpoints.authorization
      }?${params.toString()}`
    },
    async resolveCode () {
      const route = useRoute()
      const code = route.query.code ?? ''
      const stateFromRequest = route.query.state ?? ''
      const stateFromCookie = useCookie('contentwave_state')
      const codeVerifier = useCookie('contentwave_code_verifier')

      if (stateFromRequest !== stateFromCookie.value) {
        console.warn('State mismatch', stateFromRequest, stateFromCookie.value)
        return this.login()
      }

      const response = await fetch(this.endpoints.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: window.location.origin + this.fullCallbackUrl,
          code_verifier: codeVerifier.value,
          code: code
        })
      })

      if (!response.ok) {
        console.warn('Failed to fetch token', response)
        return this.login()
      }

      const data = await response.json()
      await this.setBearerToken(
        data.access_token,
        data.token_type,
        data.expires_in
      )
      await this.setRefreshToken(
        data.refresh_token,
        data.token_type,
        this.refreshTokenMaxAge
      )
      this.setupRefresher()
      useRouter().push('/')
    },
    async fetchUser () {
      const user = useCookie('contentwave_user', {
        expires: new Date(this.accessToken.expiresAt)
      })
      try {
        const response = await fetch(this.endpoints.userInfo, {
          headers: {
            Accept: 'application/json',
            Authorization: `${this.accessToken.tokenType} ${this.accessToken.token}`
          }
        })
        user.value = response.ok ? await response.json() : null
        this.userdata = user.value
      } catch (e) {
        this.userdata = null
        user.value = null
      }
    },
    async refresh () {
      if (!this.refreshToken) return

      const response = await fetch(this.endpoints.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          refresh_token: this.refreshToken.token
        })
      })

      if (!response.ok) {
        console.warn('Failed to fetch token', response)
        return this.login()
      }

      const data = await response.json()
      await this.setBearerToken(
        data.access_token,
        data.token_type,
        data.expires_in
      )
      this.setupRefresher()
    },
    async logout () {
      if (this.refresher) clearTimeout(this.refresher)
      try {
        await fetch(this.endpoints.logout, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `${this.accessToken.value.tokenType} ${this.accessToken.value.token}`
          }
        })
      } catch {}

      this.accessToken = null
      this.refreshToken = null
      this.userdata = null
      const cookieAt = useCookie('contentwave_access_token')
      const cookieRt = useCookie('contentwave_refresh_token')
      const cookieU = useCookie('contentwave_user')
      cookieAt.value = null
      cookieRt.value = null
      cookieU.value = null

      this.login()
    },
    async setBearerToken (token, tokenType, expires) {
      const cookie = useCookie('contentwave_access_token', {
        expires: new Date(Date.now() + expires * 1000)
      })
      this.accessToken = {
        token,
        tokenType,
        expiresAt: Date.now() + expires * 1000
      }
      cookie.value = this.accessToken
      await this.fetchUser()
    },
    async setRefreshToken (token, tokenType, expires) {
      const cookie = useCookie('contentwave_refresh_token', {
        expires: new Date(Date.now() + expires * 1000)
      })
      this.refreshToken = {
        token,
        tokenType,
        expiresAt: Date.now() + expires * 1000
      }
      cookie.value = this.refreshToken
    },
    async setupRefresher () {
      if (this.refresher !== null) clearTimeout(this.refresher)
      if (!this.accessToken) return
      this.refresher = setTimeout(() => {
        this.refresh()
      }, this.accessToken.expiresAt - Date.now() - 120000)
    },
    bearerToken () {
      return this.accessToken
        ? `${this.accessToken.tokenType} ${this.accessToken.token}`
        : null
    }
  }
})
