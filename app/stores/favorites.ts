import type { Post } from '~/types/api'

type FavoritePost = Pick<Post, 'id' | 'title'>

/**
 * Setup-Store für favorisierte Posts.
 * Persistiert per Cookie, damit der Zustand auch beim SSR verfügbar ist.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const items = useCookie<FavoritePost[]>('favorites', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const count = computed(() => items.value.length)

  function isFavorite(id: number) {
    return items.value.some(item => item.id === id)
  }

  function toggle(post: FavoritePost) {
    items.value = isFavorite(post.id)
      ? items.value.filter(item => item.id !== post.id)
      : [...items.value, { id: post.id, title: post.title }]
  }

  function clear() {
    items.value = []
  }

  return { items, count, isFavorite, toggle, clear }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavoritesStore, import.meta.hot))
}
