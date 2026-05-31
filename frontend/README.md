# Mybooks — Frontends

Monorepo con dos implementaciones de la misma app (Vue y Svelte) y lógica TypeScript compartida en `@mybooks/shared`.

Diagramas de arquitectura: [arquitectura.md](./arquitectura.md).

## Estructura

```
frontend/
├── packages/shared/   # types, utils, services (API REST + Google Books)
├── apps/vue/          # Vue 3 + Vue Router  → http://localhost:5173
└── apps/svelte/       # Svelte 5 + svelte-spa-router → http://localhost:5174
```

## Requisitos

- Node.js 24+ (`nvm use` en esta carpeta)
- pnpm 11
- Backend NestJS en `http://localhost:3000`
- `.env` en la **raíz del repo** (`2026-1-t5-g3/.env`) con `VITE_API_URL` y `VITE_GOOGLE_BOOKS_API_KEY`

## Comandos

```bash
cd frontend
pnpm install
pnpm dev          # Vue :5173 + Svelte :5174 en paralelo
pnpm dev:vue      # Solo Vue
pnpm dev:svelte   # Solo Svelte
pnpm build        # Build de ambas apps
pnpm type-check   # TypeScript en shared + apps
```

## Qué va en cada capa

| Capa | `@mybooks/shared` | `apps/vue` / `apps/svelte` |
|------|-------------------|----------------------------|
| Types, utils | Sí | No |
| Services HTTP | Sí (factories) | Solo `services/instance.ts` + re-exports |
| Stores reactivos | No | Sí |
| Components / views | No | Sí |
| Router | No | Sí |

Cambios de contrato API o modelos de dominio: editar `packages/shared` una sola vez.
