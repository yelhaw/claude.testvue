<script setup lang="ts">
import type { Post } from '~/types/api'

defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="card">
    <header class="card-header">
      <h2>
        <NuxtLink :to="`/posts/${post.id}`">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <FavoriteButton :post="post" />
    </header>
    <p class="body">
      {{ post.body }}
    </p>
    <footer class="meta">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="tag"
      >#{{ tag }}</span>
      <span>👍 {{ post.reactions.likes }}</span>
      <span>👁 {{ post.views }}</span>
    </footer>
  </article>
</template>

<style scoped>
.card {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
}

.card-header {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: start;
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

.body {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--color-muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}
</style>
