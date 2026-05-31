# Mybooks — Frontend Svelte

## Requisitos

- Node.js 24 (ver `.nvmrc`: `nvm use`)
- [pnpm](https://pnpm.io/) — **usar solo pnpm**, no npm

## Configuración

Las variables de entorno se leen desde el `.env` en la **raíz del repositorio** (un nivel arriba de esta carpeta).

1. Copia el archivo de ejemplo en la raíz del proyecto:

```bash
cp ../.env.example ../.env
```

2. Edita `../.env` y agrega:

```
VITE_GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3000
```

Puedes obtener una key en [Google Cloud Console](https://console.cloud.google.com/) habilitando la **Books API**.

El backend debe estar corriendo en `http://localhost:3000` para registro, listas, perfiles y recomendaciones.

## Ejecutar

```bash
nvm use
pnpm install
pnpm dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home: búsqueda, listas y dashboard |
| `/book/:id` | Detalle de libro (Google Books + estado en tu biblioteca) |
| `/users/:id` | Perfil de usuario, amigos y recomendaciones |
| `/login` | Iniciar sesión (redirige a `/` si ya hay sesión) |
| `/register` | Registro (redirige a `/` si ya hay sesión) |

Haz clic en el título o la portada de un libro para abrir `/book/:id`.

## Funcionalidades

- Buscar libros (Google Books API)
- Registro e inicio de sesión (JWT en `localStorage`)
- Listas: Quiero leer, Leyendo, Leídos
- Progreso por página; al completar páginas el libro pasa a Leídos
- Dashboard con estadísticas del año
- Detalle de libro (metadatos de Google Books)
- Perfiles, seguir usuarios, recomendaciones y carrusel de amigos

## Otros comandos

```bash
pnpm build    # build de producción
pnpm preview  # previsualizar el build
pnpm check    # verificación de tipos
```

## Estructura

- `src/services/` — llamadas HTTP al backend y Google Books
- `src/stores/` — estado global (`auth`, `books`, `social`)
- `src/utils/` — utilidades (`bookCover`, `router` con `goBack`)
- `src/views/` — pantallas principales
- `src/components/` — UI reutilizable

La referencia de comportamiento es `frontend-vue/`.
