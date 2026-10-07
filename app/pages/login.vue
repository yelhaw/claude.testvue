<script setup lang="ts">
import type { LoginCredentials } from '~/types/api'

useSeoMeta({ title: 'Login' })

const auth = useAuthStore()
const route = useRoute()

// Nur interne Pfade zulassen (kein Open Redirect)
const redirectTarget = computed(() => {
  const target = route.query.redirect
  return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
    ? target
    : '/'
})

// Demo-Zugang von DummyJSON
const form = reactive<LoginCredentials>({ username: 'emilys', password: 'emilyspass' })
const pending = ref(false)
const errorMessage = ref<string | null>(null)

async function submit() {
  pending.value = true
  errorMessage.value = null

  try {
    await auth.login({ ...form })
    await navigateTo(redirectTarget.value, { replace: true })
  }
  catch {
    errorMessage.value = 'Login fehlgeschlagen. Bitte Zugangsdaten prüfen.'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <section class="stack">
    <h1>Login</h1>

    <p v-if="auth.isLoggedIn">
      Du bist bereits als {{ auth.user?.username }} angemeldet.
    </p>

    <form
      v-else
      class="stack form"
      @submit.prevent="submit"
    >
      <label>
        Benutzername
        <input
          v-model.trim="form.username"
          autocomplete="username"
          required
        >
      </label>
      <label>
        Passwort
        <input
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          required
        >
      </label>
      <button
        class="button"
        type="submit"
        :disabled="pending"
      >
        {{ pending ? 'Anmelden …' : 'Anmelden' }}
      </button>
      <p
        v-if="errorMessage"
        class="error"
      >
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>

<style scoped>
.form {
  max-width: 24rem;
}

label {
  display: grid;
  gap: 0.25rem;
  font-weight: 600;
}

input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background: var(--color-surface);
  color: inherit;
  font: inherit;
}
</style>
