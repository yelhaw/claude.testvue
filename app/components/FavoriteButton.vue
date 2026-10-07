<script setup lang="ts">
import type { Post } from '~/types/api'

const props = defineProps<{
  post: Pick<Post, 'id' | 'title'>
}>()

const favorites = useFavoritesStore()
const active = computed(() => favorites.isFavorite(props.post.id))
</script>

<template>
  <button
    type="button"
    class="favorite"
    :aria-pressed="active"
    :title="active ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
    @click="favorites.toggle(post)"
  >
    {{ active ? '★' : '☆' }}
  </button>
</template>

<style scoped>
.favorite {
  border: none;
  background: none;
  font-size: 1.25rem;
  color: var(--color-primary);
  cursor: pointer;
}
</style>
