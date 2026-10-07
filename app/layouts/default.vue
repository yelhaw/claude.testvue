<script setup lang="ts">
const favorites = useFavoritesStore()
</script>

<template>
  <div class="layout">
    <header class="header">
      <nav class="container nav">
        <NuxtLink
          to="/"
          class="brand"
        >
          Claude TestVue
        </NuxtLink>
        <NuxtLink to="/posts">
          Posts
        </NuxtLink>
        <NuxtLink to="/posts/new">
          Neuer Post
        </NuxtLink>
        <NuxtLink to="/favorites">
          Favoriten ({{ favorites.count }})
        </NuxtLink>
      </nav>
    </header>

    <main class="container main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.nav {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding-block: 1rem;
}

.nav a.router-link-active:not(.brand) {
  font-weight: 600;
}

.brand {
  margin-right: auto;
  font-weight: 700;
}

.main {
  padding-block: 2rem;
}
</style>
