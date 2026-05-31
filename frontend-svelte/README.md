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

El backend debe estar corriendo en `http://localhost:3000` para registro e inicio de sesión.

## Ejecutar

```bash
nvm use
pnpm install
pnpm dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Otros comandos

```bash
pnpm build    # build de producción
pnpm preview  # previsualizar el build
pnpm check    # verificación de tipos
```
