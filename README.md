# Trabajo 5 - Frameworks Vue y Svelte

Este repositorio contiene **MyBooks**, una aplicacion de libros desarrollada en dos frontends distintos: uno con **Vue** y otro con **Svelte**. Ambas aplicaciones consumen el mismo backend y permiten comparar como se implementan funcionalidades similares usando frameworks diferentes.

## Descripcion general

MyBooks permite buscar libros, registrar usuarios, iniciar sesion, guardar libros en una biblioteca personal, marcar estados de lectura, actualizar progreso, seguir a otros usuarios y ver recomendaciones.

El proyecto esta dividido en tres partes principales:

```txt
backend/           API REST desarrollada con NestJS
frontend-vue/      Aplicacion frontend desarrollada con Vue + Vite
frontend-svelte/   Aplicacion frontend desarrollada con Svelte + Vite
```

## Tecnologias principales

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL, JWT y bcrypt.
- **Base de datos:** PostgreSQL levantado localmente con Docker.
- **Frontend Vue:** Vue 3, Vue Router, TypeScript y Vite.
- **Frontend Svelte:** Svelte 5, TypeScript y Vite.
- **API externa:** Google Books API para buscar informacion de libros.

## Configuracion inicial

En la raiz del proyecto existe un archivo `.env.example`. Para configurar las variables compartidas por los frontends, copia ese archivo:

```bash
cp .env.example .env
```

Luego completa las variables:

```env
VITE_GOOGLE_BOOKS_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3000
```

La API key se obtiene desde Google Cloud Console habilitando la Books API.

El backend tambien necesita su propio archivo `.env` dentro de `backend/`. Las instrucciones completas estan en [backend/README.md](backend/README.md).

## Documentacion por aplicacion

Cada parte del proyecto tiene instrucciones mas especificas:

- [Backend](backend/README.md)
- [Frontend Vue](frontend-vue/README.md)
- [Frontend Svelte](frontend-svelte/README.md)
