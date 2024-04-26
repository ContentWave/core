let store = null

function getHeaders () {
  const authStore = useAuthStore()
  const token = authStore.bearerToken()
  if (!token) return {}
  return {
    Authorization: token
  }
}

export const useApi = () => ({
  async get (url, query = {}, options = {}) {
    const config = useRuntimeConfig()
    return $fetch(`${config.public.apiUrl}${url}`, {
      method: 'GET',
      query,
      headers: getHeaders(),
      ...options
    }).catch(async err => {
      if (err.status === 403 && store.loggedIn) {
        await store.logout()
      }
      throw err
    })
  },
  async delete (url, query = {}, options = {}) {
    const config = useRuntimeConfig()
    return $fetch(`${config.public.apiUrl}${url}`, {
      method: 'DELETE',
      query,
      headers: getHeaders(),
      ...options
    }).catch(async err => {
      if (err.status === 403 && store.loggedIn) {
        await store.logout()
      }
      throw err
    })
  },
  async post (url, body = {}, options = {}) {
    const config = useRuntimeConfig()
    return $fetch(`${config.public.apiUrl}${url}`, {
      method: 'POST',
      body,
      headers: getHeaders(),
      ...options
    }).catch(async err => {
      if (err.status === 403 && store.loggedIn) {
        await store.logout()
      }
      throw err
    })
  },
  async patch (url, body = {}, options = {}) {
    const config = useRuntimeConfig()
    return $fetch(`${config.public.apiUrl}${url}`, {
      method: 'PATCH',
      body,
      headers: getHeaders(),
      ...options
    }).catch(async err => {
      if (err.status === 403 && store.loggedIn) {
        await store.logout()
      }
      throw err
    })
  },
  async put (url, body = {}, options = {}) {
    const config = useRuntimeConfig()
    return $fetch(`${config.public.apiUrl}${url}`, {
      method: 'PUT',
      body,
      headers: getHeaders(),
      ...options
    }).catch(async err => {
      if (err.status === 403 && store.loggedIn) {
        await store.logout()
      }
      throw err
    })
  }
})
