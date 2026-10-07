<script setup lang="ts">
definePageMeta({
  validate: route => /^\d+$/.test(String(route.params.id)),
})

const route = useRoute('posts-id')
const id = computed(() => Number(route.params.id))

const { data: post, error } = await usePost(id)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: 'Post nicht gefunden',
    fatal: true,
  })
}

useSeoMeta({
  title: () => post.value?.title ?? 'Post',
  description: () => post.value?.body.slice(0, 150),
})
</script>

<template>
  <article
    v-if="post"
    class="stack"
  >
    <NuxtLink to="/posts">
      ← Zurück zur Übersicht
    </NuxtLink>
    <header class="header">
      <h1>{{ post.title }}</h1>
      <FavoriteButton :post="post" />
    </header>
    <p>{{ post.body }}</p>
    <p class="meta">
      👍 {{ post.reactions.likes }} · 👎 {{ post.reactions.dislikes }} · 👁 {{ post.views }}
    </p>
  </article>
</template>

<style scoped>
.header {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.meta {
  color: var(--color-muted);
}
</style>
