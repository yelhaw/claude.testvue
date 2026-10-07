<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const route = useRoute()

/** Behält vorhandene Query-Parameter bei und setzt nur `page` */
function pageLink(page: number) {
  return { query: { ...route.query, page: page > 1 ? page : undefined } }
}

/** Kompakte Seitenliste, z. B. 1 … 4 5 [6] 7 8 … 15 */
const pages = computed<(number | '…')[]>(() => {
  const { currentPage: current, totalPages: total } = props
  const range: (number | '…')[] = []

  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 2) {
      range.push(page)
    }
    else if (range.at(-1) !== '…') {
      range.push('…')
    }
  }

  return range
})
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
    aria-label="Seitennavigation"
  >
    <NuxtLink
      v-if="currentPage > 1"
      :to="pageLink(currentPage - 1)"
      rel="prev"
    >
      ← Zurück
    </NuxtLink>

    <template
      v-for="(page, index) in pages"
      :key="index"
    >
      <span
        v-if="page === '…'"
        class="ellipsis"
      >…</span>
      <NuxtLink
        v-else
        :to="pageLink(page)"
        :aria-current="page === currentPage ? 'page' : undefined"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </NuxtLink>
    </template>

    <NuxtLink
      v-if="currentPage < totalPages"
      :to="pageLink(currentPage + 1)"
      rel="next"
    >
      Weiter →
    </NuxtLink>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  margin-top: 2rem;
}

.pagination a {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  text-decoration: none;
}

.pagination a.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.ellipsis {
  padding-inline: 0.25rem;
}
</style>
