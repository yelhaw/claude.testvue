<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({ title: 'Fehler' })
</script>

<template>
  <NuxtLayout>
    <section class="stack">
      <h1>{{ error.statusCode }}</h1>
      <p>{{ error.statusMessage || error.message }}</p>
      <div>
        <button
          class="button"
          @click="clearError({ redirect: '/' })"
        >
          Zur Startseite
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>
