<script setup lang="ts">
useSeoMeta({ title: 'Favoriten' })

const favorites = useFavoritesStore()
const { items, count } = storeToRefs(favorites)
</script>

<template>
  <section class="stack">
    <h1>Favoriten</h1>

    <p v-if="count === 0">
      Noch keine Favoriten. Markiere Posts in der
      <NuxtLink to="/posts">
        Übersicht
      </NuxtLink> mit ☆.
    </p>

    <template v-else>
      <ul>
        <li
          v-for="item in items"
          :key="item.id"
        >
          <NuxtLink :to="`/posts/${item.id}`">
            {{ item.title }}
          </NuxtLink>
          <FavoriteButton :post="item" />
        </li>
      </ul>
      <div>
        <button
          class="button"
          @click="favorites.clear()"
        >
          Alle entfernen
        </button>
      </div>
    </template>
  </section>
</template>
