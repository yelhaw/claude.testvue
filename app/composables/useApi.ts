import type { UseFetchOptions } from 'nuxt/app'

/**
 * SSR-fähiges Daten-Laden über den zentralen API-Client.
 * Gleiche API wie `useFetch`, nutzt aber `$api` (baseURL, Auth, Fehlerbehandlung).
 *
 * @example
 *   const { data, status, error, refresh } = await useApi<Post>(() => `/posts/${id}`)
 */
export function useApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}
