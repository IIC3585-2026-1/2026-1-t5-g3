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

También deberían quedar aplicadas las entidades que están creadas con TypeORM en la base de datos del contenedor.