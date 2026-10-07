/**
 * Zentraler API-Client auf Basis von ofetch ($fetch).
 *
 * - baseURL kommt aus der runtimeConfig (NUXT_PUBLIC_API_BASE)
 * - hängt automatisch einen Bearer-Token an, falls vorhanden
 * - zentrale Fehlerbehandlung (z. B. 401)
 *
 * Verwendung:
 *   const { $api } = useNuxtApp()
 *   await $api('/posts/add', { method: 'POST', body: { ... } })
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
