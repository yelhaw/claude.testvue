import type { NewPost, Post, PostList } from '~/types/api'

/** Paginierte Post-Liste – lädt automatisch neu, sobald sich `page` ändert. */
export function usePostList(page: MaybeRefOrGetter<number>, pageSize = 10) {
  return useApi<PostList>('/posts', {
    query: computed(() => ({
      limit: pageSize,
      skip: (toValue(page) - 1) * pageSize,
    })),
  })
}

export function usePost(id: MaybeRefOrGetter<number>) {
  return useApi<Post>(() => `/posts/${toValue(id)}`)
}

/** Imperative Aufrufe (Mutationen) – z. B. aus Event-Handlern oder Pinia-Actions */
export function usePostsService() {
  const { $api } = useNuxtApp()

  return {
    create: (post: NewPost) => $api<Post>('/posts/add', { method: 'POST', body: post }),
    remove: (id: number) => $api<Post>(`/posts/${id}`, { method: 'DELETE' }),
  }
}
