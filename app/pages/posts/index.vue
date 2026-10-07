<script setup lang="ts">
const PAGE_SIZE = 10

const route = useRoute()

const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})

const { data, status, error, refresh } = await usePostList(page, PAGE_SIZE)

const totalPages = computed(() => Math.ceil((data.value?.total ?? 0) / PAGE_SIZE))

useSeoMeta({
  title: () => (page.value > 1 ? `Posts – Seite ${page.value}` : 'Posts'),
})
</script>

<template>
  <section class="stack">
    <h1>Posts</h1>

    <p
      v-if="error"
      class="error"
    >
      Fehler beim Laden: {{ error.message }}
      <button
        class="button"
        @click="refresh()"
      >
        Erneut versuchen
      </button>
    </p>

    <template v-else-if="data">
      <p>Seite {{ page }} von {{ totalPages }} · {{ data.total }} Einträge</p>

      <div
        class="stack"
        :class="{ loading: status === 'pending' }"
      >
        <PostCard
          v-for="post in data.posts"
          :key="post.id"
          :post="post"
        />
      </div>

      <AppPagination
        :current-page="page"
        :total-pages="totalPages"
      />
    </template>
  </section>
</template>

<style scoped>
.loading {
  opacity: 0.5;
  transition: opacity 0.2s;
}
</style>
