import type { AuthUser, LoginCredentials, LoginResponse } from '~/types/api'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'lax',
} as const

/**
 * Login-Zustand inkl. API-Key.
 *
 * Der Key wird per Cookie persistiert, damit er auch bei SSR-Requests
 * verfügbar ist. `requestHeaders` wird vom `$api`-Client automatisch an
 * jeden Request angehängt (siehe app/plugins/api.ts).
 */
export const useAuthStore = defineStore('auth', () => {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()

  const apiKey = useCookie<string | null>('api_key', { default: () => null, ...COOKIE_OPTIONS })
  const user = useCookie<AuthUser | null>('auth_user', { default: () => null, ...COOKIE_OPTIONS })

  const isLoggedIn = computed(() => Boolean(apiKey.value))

  /** Standard-Header für jeden API-Request – hier weitere ergänzen */
  const requestHeaders = computed<Record<string, string>>(() =>
    apiKey.value ? { [config.public.apiKeyHeader]: apiKey.value } : {},
  )

  async function login(credentials: LoginCredentials) {
    const response = await nuxtApp.$api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    })

    // Mapping an die eigene API anpassen (DummyJSON liefert `accessToken`)
    apiKey.value = response.accessToken
    user.value = {
      id: response.id,
      username: response.username,
      firstName: response.firstName,
      lastName: response.lastName,
    }
  }

  function logout() {
    apiKey.value = null
    user.value = null
  }

  return { apiKey, user, isLoggedIn, requestHeaders, login, logout }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
