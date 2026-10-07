<script setup lang="ts">
useSeoMeta({
  title: 'Start',
  description: 'Vue 3 + Nuxt 4 Starter mit Pinia, ESLint und typisiertem API-Client.',
})
</script>

<template>
  <section class="stack">
    <h1>Vue 3 + Nuxt 4 Starter</h1>
    <p>
      Dateibasiertes Routing, Pinia für den State, ESLint (Flat Config) und ein
      zentraler, typisierter API-Client.
    </p>
    <ul>
      <li>
        <NuxtLink to="/posts">
          Paginierte Post-Liste
        </NuxtLink> – Seitenwechsel über <code>?page=</code>, SSR-fähig
      </li>
      <li>
        <NuxtLink to="/posts/new">
          Post anlegen
        </NuxtLink> – Mutation über <code>$api</code>
      </li>
      <li>
        <NuxtLink to="/favorites">
          Favoriten
        </NuxtLink> – Pinia-Store, per Cookie persistiert
      </li>
    </ul>
  </section>
</template>
