# Claude TestVue

Vue-3-Starter nach aktuellem Best-Practice-Stand:

| Bereich         | Lösung                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | [Nuxt 4](https://nuxt.com) (Vue 3.5, Vite, SSR, dateibasiertes Routing) |
| State           | [Pinia](https://pinia.vuejs.org) via `@pinia/nuxt` (Setup-Stores)      |
| API             | Zentraler `$api`-Client (ofetch) + `useApi`-Composable                 |
| Linting/Format  | ESLint 10 Flat Config via `@nuxt/eslint` inkl. Stylistic-Regeln        |
| Typen           | TypeScript (strict) + `vue-tsc`                                        |
| CI              | GitHub Actions: Lint → Typecheck → Build                               |

## Setup

Voraussetzungen: Node ≥ 22, pnpm (`corepack enable`).

```bash
pnpm install
cp .env.example .env   # optional: API-Basis-URL anpassen
pnpm dev               # http://localhost:3000
```

| Script            | Zweck                              |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Dev-Server mit HMR                 |
| `pnpm build`      | Produktions-Build (`.output/`)     |
| `pnpm preview`    | Produktions-Build lokal starten    |
| `pnpm generate`   | Statische Seite erzeugen           |
| `pnpm lint`       | ESLint                             |
| `pnpm lint:fix`   | ESLint mit Auto-Fix (inkl. Format) |
| `pnpm typecheck`  | TypeScript-Prüfung (`vue-tsc`)     |

## Projektstruktur

```
app/
├── app.vue                 # Root: Layout + Seite
├── error.vue               # Globale Fehlerseite (404/500)
├── assets/css/main.css     # Globale Styles / Design-Tokens
├── components/             # Auto-importierte Komponenten
│   ├── AppPagination.vue   # Wiederverwendbare Paginierung (?page=)
│   ├── FavoriteButton.vue
│   └── PostCard.vue
├── composables/
│   ├── useApi.ts           # SSR-fähiges useFetch über $api
│   └── usePosts.ts         # Beispiel-„Service“ für eine Ressource
├── layouts/default.vue
├── pages/                  # Dateibasiertes Routing
│   ├── index.vue           # /
│   ├── favorites.vue       # /favorites
│   └── posts/
│       ├── index.vue       # /posts?page=2
│       ├── [id].vue        # /posts/42
│       └── new.vue         # /posts/new
├── plugins/api.ts          # $api: baseURL, Auth-Header, Fehlerbehandlung
├── stores/favorites.ts     # Pinia-Store (auto-importiert)
└── types/api.ts            # API-Typen
```

## APIs ansprechen

Die Basis-URL steht in `nuxt.config.ts` unter `runtimeConfig.public.apiBase` und
lässt sich per Umgebungsvariable `NUXT_PUBLIC_API_BASE` überschreiben (auch zur
Laufzeit des gebauten Servers). Als Demo-Backend dient [DummyJSON](https://dummyjson.com).

**Daten laden (SSR-fähig, reaktiv, mit Caching/Dedupe):**

```ts
const { data, status, error, refresh } = await useApi<Post>(() => `/posts/${id.value}`)
```

**Mutationen / imperative Aufrufe** (Event-Handler, Pinia-Actions):

```ts
const { $api } = useNuxtApp()
const post = await $api<Post>('/posts/add', { method: 'POST', body: { title: 'Hallo' } })
```

**Neue Ressource anbinden** – Typen in `app/types/` anlegen und analog zu
`app/composables/usePosts.ts` ein Composable schreiben:

```ts
export function useUserList(page: MaybeRefOrGetter<number>) {
  return useApi<UserList>('/users', {
    query: computed(() => ({ limit: 10, skip: (toValue(page) - 1) * 10 })),
  })
}
```

Ist ein Token im Cookie `auth_token` gesetzt, sendet `$api` es automatisch als
`Authorization: Bearer …`; bei `401` wird es entfernt (siehe `app/plugins/api.ts`).

## Paging

- **Routing:** Dateien in `app/pages/` werden automatisch zu Routen, inkl.
  dynamischer Segmente (`[id].vue`) und typisierter Routen (`useRoute('posts-id')`).
- **Paginierung:** Die aktuelle Seite steckt in der URL (`/posts?page=3`) – teilbar,
  SEO-freundlich und mit Browser-Zurück kompatibel. Ändert sich `page`, lädt
  `usePostList` dank reaktiver Query automatisch neu. `AppPagination` ist generisch
  und kann für jede Liste wiederverwendet werden.

## State (Pinia)

Stores liegen in `app/stores/` und werden automatisch importiert:

```ts
const favorites = useFavoritesStore()
const { items, count } = storeToRefs(favorites)   // reaktive Destrukturierung
favorites.toggle(post)
```

Der Beispiel-Store persistiert per `useCookie`, sodass der Zustand auch beim
Server-Rendering verfügbar ist.
