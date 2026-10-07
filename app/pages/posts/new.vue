<script setup lang="ts">
import type { NewPost, Post } from '~/types/api'

definePageMeta({ middleware: 'auth' })

useSeoMeta({ title: 'Neuer Post' })

const postsService = usePostsService()

const form = reactive<NewPost>({ title: '', body: '', userId: 1 })
const pending = ref(false)
const errorMessage = ref<string | null>(null)
const created = ref<Post | null>(null)

async function submit() {
  pending.value = true
  errorMessage.value = null

  try {
    created.value = await postsService.create({ ...form })
    form.title = ''
    form.body = ''
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unbekannter Fehler'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="stack">
    <h1>Neuer Post</h1>
    <p>
      Demonstriert eine Mutation über den zentralen API-Client. DummyJSON
      simuliert das Speichern nur.
    </p>

    <form
      class="stack form"
      @submit.prevent="submit"
    >
      <label>
        Titel
        <input
          v-model.trim="form.title"
          required
        >
      </label>
      <label>
        Inhalt
        <textarea
          v-model.trim="form.body"
          rows="5"
          required
        />
      </label>
      <button
        class="button"
        type="submit"
        :disabled="pending"
      >
        {{ pending ? 'Speichere …' : 'Speichern' }}
      </button>
    </form>

    <p
      v-if="errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </p>
    <p v-if="created">
      ✅ Post „{{ created.title }}" angelegt (ID {{ created.id }}).
    </p>
  </section>
</template>

<style scoped>
.form {
  max-width: 40rem;
}

label {
  display: grid;
  gap: 0.25rem;
  font-weight: 600;
}

input,
textarea {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-surface);
  color: inherit;
  font: inherit;
}
</style>
