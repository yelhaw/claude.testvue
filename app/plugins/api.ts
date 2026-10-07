/**
 * Zentraler API-Client auf Basis von ofetch ($fetch).
 *
 * - baseURL kommt aus der runtimeConfig (NUXT_PUBLIC_API_BASE)
 * - hängt nach dem Login automatisch die Standard-Header des Auth-Stores
 *   an (z. B. `x-api-key`), sowohl im Browser als auch beim SSR
 * - bei 401 wird der User abgemeldet und zum Login geleitet
 *
 * Verwendung:
 *   const { $api } = useNuxtApp()
 *   await $api('/posts/add', { method: 'POST', body: { ... } })
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      for (const [name, value] of Object.entries(auth.requestHeaders)) {
        // Explizit beim Aufruf gesetzte Header haben Vorrang
        if (!options.headers.has(name)) {
          options.headers.set(name, value)
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status !== 401 || !auth.isLoggedIn) {
        return
      }

      auth.logout()

      const route = nuxtApp._route
      if (route.path !== '/login') {
        await nuxtApp.runWithContext(() =>
          navigateTo({ path: '/login', query: { redirect: route.fullPath } }),
        )
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
