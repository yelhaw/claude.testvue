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
│   ├── login.vue           # /login
│   └── posts/
│       ├── index.vue       # /posts?page=2
│       ├── [id].vue        # /posts/42
│       └── new.vue         # /posts/new (Login erforderlich)
├── middleware/auth.ts      # Route-Schutz für eingeloggte User
├── plugins/api.ts          # $api: baseURL, x-api-key-Header, 401-Handling
├── stores/
│   ├── auth.ts             # Login-Zustand + API-Key
│   └── favorites.ts        # Pinia-Store (auto-importiert)
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

### Login & API-Key (`x-api-key`)

Nach dem Login wird der API-Key **automatisch bei jedem Request** als Header
`x-api-key` mitgeschickt, egal ob über `useApi`, `$api` oder einen Pinia-Store
und egal ob im Browser oder beim SSR. Im Code muss nichts manuell gesetzt werden.

```
Login-Formular ──► authStore.login() ──► POST /auth/login
                                         │
                       apiKey im Cookie ◄┘
                              │
jeder $api-/useApi-Request ──► onRequest-Hook ──► Header  x-api-key: <key>
```

| Datei                    | Aufgabe                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `app/stores/auth.ts`     | `login()`, `logout()`, `isLoggedIn`, `user` und `requestHeaders`        |
| `app/plugins/api.ts`     | Hängt `requestHeaders` an jeden Request; bei `401` Logout + Weiterleitung zum Login |
| `app/middleware/auth.ts` | Schützt Seiten: `definePageMeta({ middleware: 'auth' })`                |
| `app/pages/login.vue`    | Login-Formular inkl. Rücksprung (`/login?redirect=/posts/new`)          |

**Anpassen an die eigene API:**

- **Login-Antwort:** In `login()` (`app/stores/auth.ts`) festlegen, aus welchem
  Feld der Key kommt. DummyJSON liefert `accessToken`, der Demo-Login lautet
  `emilys` / `emilyspass`.
- **Header-Name:** `runtimeConfig.public.apiKeyHeader` bzw. die Umgebungsvariable
  `NUXT_PUBLIC_API_KEY_HEADER`. Standard ist `x-api-key`.
- **Weitere Standard-Parameter:** im Computed `requestHeaders` ergänzen, z. B.
  einen Mandanten- oder Sprach-Header. Alles dort wird automatisch mitgesendet.
- **Einzelfall überschreiben:** Header, die beim Aufruf explizit gesetzt werden,
  haben Vorrang:
  `$api('/x', { headers: { 'x-api-key': 'anderer-key' } })`

> **Sicherheitshinweis:** Der Key liegt in einem für JavaScript lesbaren Cookie
> (nötig, damit Browser und SSR ihn mitsenden können). Für sensible Keys ist ein
> serverseitiger Proxy (Nitro-Route unter `server/api/`) mit `httpOnly`-Cookie
> die sicherere Variante.

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
