# Mybooks — Frontend Svelte

## Requisitos

- Node.js 20.19+ o 22.12+ (recomendado: usar la versión de `.nvmrc`)
- [pnpm](https://pnpm.io/)

## Configuración

La API key se lee desde el `.env` en la **raíz del repositorio** (un nivel arriba de esta carpeta).

1. Copia el archivo de ejemplo en la raíz del proyecto:

```bash
cp ../.env.example ../.env
```

2. Edita `../.env` y agrega tu key de Google Books:

```
VITE_GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
```

Puedes obtener una key en [Google Cloud Console](https://console.cloud.google.com/) habilitando la **Books API**.

## Ejecutar

```bash
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
