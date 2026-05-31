# Backend Setup

Backend desarrollado con NestJS, TypeORM y PostgreSQL.

Este proyecto usa PostgreSQL dentro de un contenedor Docker.

## Requisitos previos

Antes de correr el proyecto, para el setup hay que tener instalado:

- Node.js
- npm
- Docker Desktop
- NestJS CLI

Para instalar NestJS CLI globalmente:

```bash
npm i -g @nestjs/cli
```

Verificar instalación:

```bash
nest --version
```

## Primera instalación del proyecto

### 1. Moverse al directorio del backend desde la raiz del proyecto

```bash
cd backend
```

### 2. Instalar dependencias

Ejecutar dentro de la carpeta `backend`:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

### 3. Crear archivo `.env`

Crear un archivo `.env` en la raíz del backend con el siguiente contenido:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres_db
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRES_IN=7d
```

### 4. Abrir Docker Desktop

Antes de usar comandos Docker, asegúrate de que Docker Desktop esté abierto y corriendo.

Puedes verificarlo con:

```bash
docker ps
```

Si el comando responde sin error, Docker está listo.

### 5. Crear y levantar el contenedor PostgreSQL

Ejecutar:

```bash
docker run --name tarea-5-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres_db -p 5433:5432 -v nest-postgres-data:/var/lib/postgresql/data -d postgres:17
```

Este comando crea un contenedor llamado `tarea-5-db` usando PostgreSQL 17.

Datos de conexión:

```txt
Host: localhost
Puerto: 5433
Usuario: postgres
Contraseña: postgres
Base de datos: postgres_db
```


### 6. Verificar que el contenedor está corriendo

```bash
docker ps
```

Debería aparecer un contenedor llamado:

```txt
tarea-5-db
```

### 7. Correr el backend

```bash
npm run start:dev
```

El backend debería quedar corriendo en:

```txt
http://localhost:3000
```

## Autenticación (JWT)

Endpoints disponibles:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registro (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Inicio de sesión (`email`, `password`) |
| `GET` | `/auth/profile` | Perfil del usuario autenticado (requiere `Authorization: Bearer <token>`) |

### Libros del usuario (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/user-books/me` | Lista todos los libros del usuario |
| `GET` | `/user-books/dashboard` | Estadísticas: leídos este año y pendientes |
| `POST` | `/user-books` | Agregar libro (`externalApiId`, `title`, `authors`, `status`) |
| `PATCH` | `/user-books/:id/status` | Cambiar estado (`READ`, `WANT_TO_READ`) |
| `PATCH` | `/user-books/:id/progress` | Actualizar página actual (`currentPage`). El % se calcula con el total de páginas. Al llegar al total pasa a `READ` |
| `DELETE` | `/user-books/:id` | Quitar libro de la biblioteca |

### Seguimiento y amigos (requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/follows/:userId` | Seguir a un usuario |
| `DELETE` | `/follows/:userId` | Dejar de seguir |
| `GET` | `/follows/me/friends` | Lista de amigos (seguimiento mutuo) |

### Perfiles y usuarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/users/search?q=` | JWT | Buscar usuarios por nombre |
| `GET` | `/users/:id/profile` | Opcional | Perfil público: libros leídos este año, recomendaciones, amigos, estado de seguimiento |
| `GET` | `/users/:id/friends` | No | Amigos de un usuario |

### Recomendaciones de perfil

Un usuario puede recomendar libros en su perfil si el libro está en `READING` con ≥10% de progreso o en estado `READ`. Rating obligatorio (1–5), comentario opcional.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/recommendations/friends` | JWT | Recomendaciones de amigos (feed del carrusel) |
| `POST` | `/recommendations` | JWT | Crear recomendación (`userBookId`, `rating`, `message?`) |
| `PATCH` | `/recommendations/:id` | JWT | Editar rating o comentario |
| `DELETE` | `/recommendations/:id` | JWT | Quitar recomendación del perfil |

La respuesta de register/login incluye `accessToken` y `user` (`id`, `name`, `email`).

También deberían quedar aplicadas las entidades que están creadas con TypeORM en la base de datos del contenedor.