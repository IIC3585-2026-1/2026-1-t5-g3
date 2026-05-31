# Mybooks — Frontend Vue

## Requisitos

- Node.js 20.19+ o 22.12+ (ver `engines` en `package.json`)
- [pnpm](https://pnpm.io/)

## Configuración

La API key se lee desde el `.env` en la **raíz del repositorio** (un nivel arriba de esta carpeta).

1. Copia el archivo de ejemplo en la raíz del proyecto:

```bash
cp ../.env.example ../.env
```

2. Edita `../.env` y agrega tus variables:

```
VITE_GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3000
```

Puedes obtener una key de Google Books en [Google Cloud Console](https://console.cloud.google.com/) habilitando la **Books API**.

El backend debe estar corriendo en `http://localhost:3000` para registro e inicio de sesión.

## Ejecutar

```bash
pnpm install
pnpm dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

Haz clic en el título o la portada de un libro para abrir su **vista detallada** (`/book/:id`) con descripción, año, editorial, ISBN, categorías y más datos de Google Books.

## Otros comandos

```bash
pnpm build       # build de producción
pnpm preview     # previsualizar el build
pnpm type-check  # verificación de tipos
```

## Autenticación

- `/` — accesible sin sesión (búsqueda de libros). Guardar listas y dashboard requieren login.
- `/login` — iniciar sesión
- `/register` — crear cuenta

Con sesión iniciada puedes:

- Guardar libros en **Quiero leer**
- Pasarlos a **Leyendo** y registrar el **progreso (0–100%)**
- Al llegar al 100%, el libro pasa automáticamente a **Leídos**
- Marcar libros directamente como **Leídos**
- Ver el **Dashboard** con libros leídos este año, en lectura y pendientes

El JWT se guarda en `localStorage` y se envía como `Authorization: Bearer <token>` en las peticiones al backend.

## Migración desde Svelte

Este frontend es un port de `frontend-svelte`. Para detalles sobre la conversión
Svelte → Vue, ver [MIGRATION.md](./MIGRATION.md).
