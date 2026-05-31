# Arquitectura de los frontends Mybooks

Monorepo en `frontend/` con dos SPAs (Vue y Svelte) y lógica TypeScript compartida en `@mybooks/shared`.

| App | Puerto | Carpeta |
|-----|--------|---------|
| Vue | 5173 | `apps/vue` |
| Svelte | 5174 | `apps/svelte` |
| Shared | — | `packages/shared` |

Variables de entorno: `.env` en la raíz del repositorio (`VITE_API_URL`, `VITE_GOOGLE_BOOKS_API_KEY`).

---

## Vista general (ambos fronts)

```mermaid
flowchart TB
  subgraph repo [Monorepo frontend]
    shared["@mybooks/shared\ntypes, utils, services factories, CSS"]
    vueApp["apps/vue\n:5173"]
    svelteApp["apps/svelte\n:5174"]
  end

  subgraph external [Externos]
    nest["NestJS API\n:3000"]
    google["Google Books API"]
    env[".env repo root\nVITE_API_URL, VITE_GOOGLE_BOOKS_API_KEY"]
  end

  vueApp --> shared
  svelteApp --> shared
  shared --> nest
  shared --> google
  env -.-> vueApp
  env -.-> svelteApp
```

---

## Paquete compartido (`@mybooks/shared`)

```mermaid
flowchart LR
  subgraph shared [packages/shared/src]
    api["api.ts\ncreateApiClient"]
    cs["createServices.ts"]
    t["types: book, user, social, apiBook"]
    u["utils: bookCover, error, debounce, stars"]
    f1["createAuthService"]
    f2["createUserBooksService"]
    f3["createUsersService"]
    f4["createFollowsService"]
    f5["createRecommendationsService"]
    f6["createGoogleBooksService"]
  end

  cs --> api
  cs --> f1 & f2 & f3 & f4 & f5 & f6
  f2 --> t
  f2 --> u
  f6 --> u
```

Cada app inyecta el token al crear los servicios:

- **Vue:** `getToken: () => token.value` en `apps/vue/src/services/instance.ts`
- **Svelte:** `getToken: () => get(token)` en `apps/svelte/src/services/instance.ts`

---

## Frontend Vue (`apps/vue`)

### Capas

```mermaid
flowchart TB
  subgraph entry [Entrada]
    main["main.ts"]
    appVue["App.vue\nRouterView"]
    router["router/index.ts\nvue-router"]
  end

  subgraph views [Views - 5 rutas]
    home["HomeView"]
    detail["BookDetailView"]
    profile["ProfileView"]
    login["LoginView"]
    register["RegisterView"]
  end

  subgraph components [Components - 12]
    ui["ListTabs, BookSearch, BookList\nBookCard, BookCover, BookDashboard\nBookStatusBadge, UserSearch\nFriendRecommendationsCarousel\nRecommendationCard"]
  end

  subgraph state [Estado Vue]
    authStore["stores/auth.ts\nref + computed"]
    booksStore["stores/books.ts"]
    socialStore["stores/social.ts"]
  end

  subgraph bootstrap [Bootstrap app]
    instance["services/instance.ts\ncreateServices + token.value"]
    reexports["services/*.ts\nre-exports finos"]
  end

  subgraph sharedPkg ["@mybooks/shared"]
    types["types/"]
    utils["utils/"]
    svcFactories["service factories + createApiClient"]
    css["styles/app.css"]
  end

  subgraph api [APIs]
    backend["NestJS"]
    gbooks["Google Books"]
  end

  main --> appVue --> router --> views
  views --> components
  components --> state
  state --> reexports --> instance --> sharedPkg
  svcFactories --> backend
  svcFactories --> gbooks
  main --> css
```

### Rutas y guardas

```mermaid
flowchart LR
  subgraph routes [vue-router]
    r1["/ → HomeView"]
    r2["/book/:id → BookDetailView"]
    r3["/users/:id → ProfileView"]
    r4["/login → LoginView\nguestOnly"]
    r5["/register → RegisterView\nguestOnly"]
  end

  guard["beforeEach\nsi autenticado → redirige /"]
  r4 --> guard
  r5 --> guard
```

### Composición de HomeView

```mermaid
flowchart TB
  home["HomeView"]
  home --> header["Header + auth bar"]
  home --> layout["layout grid"]
  layout --> sidebar["sidebar"]
  layout --> mainCol["columna principal"]
  sidebar --> tabs["ListTabs"]
  sidebar --> carousel["FriendRecommendationsCarousel"]
  mainCol --> search["BookSearch"]
  mainCol --> panel["BookList | BookDashboard\nsegún activeTab"]
  tabs --> booksStore["stores/books.activeTab"]
  search --> booksStore
  panel --> booksStore
  carousel --> socialStore["stores/social"]
```

### Flujo: auth y libros

```mermaid
sequenceDiagram
  participant UI as View/Component
  participant Store as stores/auth|books
  participant Inst as services/instance
  participant Shared as @mybooks/shared
  participant API as NestJS

  UI->>Store: login(email, password)
  Store->>Inst: auth.login()
  Inst->>Shared: createAuthService(apiFetch)
  Shared->>API: POST /auth/login
  API-->>Shared: JWT + user
  Shared-->>Store: AuthResponse
  Store->>Store: localStorage + token ref
  Store->>Store: loadUserBooks()
  Store->>Inst: userBooks.fetchMyBooks + fetchDashboard
  Inst->>API: GET /user-books/me, /dashboard
  API-->>Store: listas + dashboard
  Store-->>UI: lists, dashboard reactivos
```

### Particularidades de Vue

| Elemento | Ubicación |
|----------|-----------|
| Router | `router/index.ts` (lazy imports) |
| Estado | `ref` / `computed` |
| Errores | refs locales y stores (sin toast global) |
| Init auth | restore desde `localStorage` en `main.ts` |

---

## Frontend Svelte (`apps/svelte`)

### Capas

```mermaid
flowchart TB
  subgraph entry [Entrada]
    main["main.ts"]
    appSvelte["App.svelte\nRouter + Toast"]
    router["svelte-spa-router\nrutas en App.svelte"]
  end

  subgraph views [Views - 5 rutas]
    home["HomeView"]
    detail["BookDetailView"]
    profile["ProfileView"]
    login["LoginView"]
    register["RegisterView"]
  end

  subgraph components [Components - 14]
    ui["ListTabs, BookSearch, BookList\nBookCard, BookCover, BookSummaryRow\nBookDashboard, BookStatusBadge\nUserSearch, GuestPrompt\nFriendRecommendationsCarousel\nRecommendationCard, Toast"]
  end

  subgraph state [Estado Svelte]
    authStore["stores/auth.ts\nwritable + derived"]
    booksStore["stores/books.ts"]
    socialStore["stores/social.ts"]
    toastStore["stores/toast.ts"]
  end

  subgraph appOnly [Solo Svelte]
    routerUtil["utils/router.ts\ngoBack pop/push"]
  end

  subgraph bootstrap [Bootstrap app]
    instance["services/instance.ts\ncreateServices + get(token)"]
    reexports["services/*.ts"]
  end

  subgraph sharedPkg ["@mybooks/shared"]
    types["types/"]
    utils["utils/"]
    svcFactories["service factories + createApiClient"]
    css["styles/app.css"]
  end

  subgraph api [APIs]
    backend["NestJS"]
    gbooks["Google Books"]
  end

  main --> appSvelte --> router --> views
  views --> components
  components --> state
  state --> reexports --> instance --> sharedPkg
  appSvelte --> toastStore
  detail --> routerUtil
  svcFactories --> backend
  svcFactories --> gbooks
```

### Rutas y condiciones

```mermaid
flowchart LR
  subgraph routes [svelte-spa-router en App.svelte]
    r1["/ → HomeView"]
    r2["/book/:id → BookDetailView"]
    r3["/users/:id → ProfileView"]
    r4["/login → wrap guestOnly"]
    r5["/register → wrap guestOnly"]
  end

  init["onMount initAuth\nvalidateSession /auth/profile"]
  app["App.svelte"] --> init
  guestOnly["guestOnly → push / si autenticado"]
  r4 --> guestOnly
  r5 --> guestOnly
```

### Composición de HomeView

```mermaid
flowchart TB
  home["HomeView"]
  home --> header["Header + auth"]
  home --> guest["GuestPrompt\nsi no autenticado"]
  home --> layout["layout"]
  layout --> sidebar["sidebar"]
  layout --> mainCol["main"]
  sidebar --> tabs["ListTabs"]
  sidebar --> carousel["FriendRecommendationsCarousel"]
  mainCol --> search["BookSearch\ndebounce @mybooks/shared"]
  mainCol --> panel["BookList | BookDashboard"]
  appRoot["App.svelte"] --> toast["Toast\nstores/toast"]
```

### Flujo: auth con validación de sesión

```mermaid
sequenceDiagram
  participant App as App.svelte
  participant Store as stores/auth
  participant Inst as services/instance
  participant Shared as @mybooks/shared
  participant API as NestJS

  App->>Store: initAuth()
  Store->>Store: restore localStorage
  Store->>Inst: auth.getProfile()
  Inst->>API: GET /auth/profile
  alt sesión válida
    API-->>Store: user actualizado
    Store->>Store: loadUserBooks + loadFriendsRecommendations
  else inválida
    Store->>Store: logout / limpiar
  end
  Note over Store: login/register también validan sesión
```

### Particularidades de Svelte

| Elemento | Ubicación |
|----------|-----------|
| Router | `App.svelte` + `svelte-spa-router` |
| Estado | `writable` / `derived` (`$store`) |
| Toast global | `stores/toast` + `Toast.svelte` |
| GuestPrompt | CTA para usuarios no autenticados |
| BookSummaryRow | fila título / autores / portada |
| goBack() | `utils/router.ts` (específico del framework) |

---

## Comparación Vue vs Svelte

```mermaid
flowchart TB
  subgraph igual [Compartido]
    routes["5 rutas con las mismas URLs"]
    sharedPkg["@mybooks/shared"]
    domain["Libros, perfiles, follows, recomendaciones"]
  end

  subgraph vue [apps/vue]
    vr["vue-router en archivo aparte"]
    vr2["stores con ref/computed"]
    vp["puerto 5173"]
  end

  subgraph svelte [apps/svelte]
    sr["router en App.svelte"]
    sr2["stores writable + toast"]
    sp["puerto 5174"]
    sv["validateSession en initAuth"]
  end

  igual --> vue
  igual --> svelte
```

### Qué vive en cada capa

| Capa | `@mybooks/shared` | Cada app (`vue` / `svelte`) |
|------|-------------------|-----------------------------|
| Types, utils | Sí | No |
| Services HTTP | Sí (factories) | `services/instance.ts` + re-exports |
| Stores reactivos | No | Sí |
| Components / views | No | Sí |
| Router | No | Sí |
| CSS global | Sí (`styles/app.css`) | Import en `main.ts` |

---

## Estructura de carpetas

```
frontend/
├── package.json
├── pnpm-workspace.yaml
├── arquitectura.md          ← este documento
├── packages/
│   └── shared/
│       └── src/
│           ├── api.ts
│           ├── index.ts
│           ├── types/
│           ├── utils/
│           ├── services/
│           └── styles/app.css
└── apps/
    ├── vue/src/
    │   ├── main.ts, App.vue
    │   ├── router/
    │   ├── stores/
    │   ├── services/instance.ts
    │   ├── components/
    │   └── views/
    └── svelte/src/
        ├── main.ts, App.svelte
        ├── stores/
        ├── services/instance.ts
        ├── utils/router.ts
        ├── components/
        └── views/
```

---

## Comandos de desarrollo

```bash
cd frontend
pnpm install
pnpm dev          # Vue :5173 + Svelte :5174
pnpm dev:vue      # Solo Vue
pnpm dev:svelte   # Solo Svelte
```

Backend (aparte):

```bash
cd backend
npm run start:dev   # http://localhost:3000
```
