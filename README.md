# Booking System - Full-Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📖 Introducción

**Booking System** es una plataforma completa de reservas construida con un stack moderno, diseñada para ser robusta, escalable y fácil de usar. Permite a los usuarios descubrir y reservar servicios ofrecidos por diferentes negocios, mientras que los dueños de los negocios pueden gestionar sus perfiles, servicios y reservas de manera eficiente.

El proyecto está completamente **dockerizado**, permitiendo un despliegue y configuración local en cuestión de minutos.

---

## ✨ Features Principales

La plataforma está organizada en tres roles de usuario principales, cada uno con su propio conjunto de funcionalidades:

### 👤 **Cliente**
- **Autenticación Segura:** Registro e inicio de sesión con JWT, incluyendo rotación de `refresh tokens`.
- **Exploración de Negocios:** Busca y filtra negocios disponibles.
- **Visualización de Servicios:** Consulta los servicios, precios y duraciones de cada negocio.
- **Sistema de Reservas:** Agenda citas en los horarios disponibles.
- **Gestión de Reservas Propias:** Visualiza, actualiza y cancela tus propias reservas.

### 🏢 **Dueño de Negocio (Owner)**
- **Gestión de Perfil de Negocio:** Crea y actualiza la información de tu negocio.
- **Administración de Servicios:** Añade, edita o elimina los servicios que ofreces.
- **Dashboard de Reservas:** Visualiza todas las reservas de tu negocio.
- **Gestión de Estado de Reservas:** Confirma, completa o rechaza las reservas pendientes.

### 👑 **Administrador (Admin)**
- **Dashboard de Administración:** Panel centralizado para la gestión de la plataforma.
- **Gestión de Usuarios:** Visualiza todos los usuarios registrados.
- **Control de Roles:** Asigna roles (Cliente, Dueño, Admin) a cualquier usuario.
- **Eliminación de Usuarios:** Da de baja a usuarios de la plataforma.

---

## 🚀 Stack Tecnológico

La arquitectura está dividida en dos componentes principales: un backend de API REST y un frontend desacoplado.

### **Backend**
- **Framework:** [NestJS](https://nestjs.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticación:** [JWT](https://jwt.io/) (Access & Refresh Tokens)
- **Validación:** `class-validator` y `class-transformer`
- **Contenerización:** [Docker](https://www.docker.com/)

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de Estado de Servidor:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/) para validación.
- **Componentes:** UI construida con componentes reutilizables.
- **Contenerización:** [Docker](https://www.docker.com/)

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura de microservicios desacoplados, orquestados con Docker Compose para el entorno de desarrollo.

```mermaid
graph TD
    subgraph "Usuario Final"
        A[Browser]
    end

    subgraph "Contenedor Frontend (Docker)"
        B[Next.js Server]
    end

    subgraph "Contenedor Backend (Docker)"
        C[NestJS API]
        D[PostgreSQL DB]
        C -- Prisma ORM --> D
    end

    A -- HTTP Request --> B
    B -- API Call --> C
```

---

## 🏁 Cómo Empezar

Cada servicio (backend y frontend) es independiente y se despliega desde su propia carpeta.

### **Requisitos Previos**
- [Docker](https://www.docker.com/get-started) y [Docker Compose](https://docs.docker.com/compose/install/) instalados.

### **1. Backend**

El backend incluye el servidor de base de datos PostgreSQL.

```bash
# 1. Navega a la carpeta del backend
cd backend

# 2. Copia las variables de entorno de ejemplo
# (Ajusta los secrets si es necesario)
cp .env.example .env

# 3. Construye y levanta los contenedores (API + DB)
docker compose up -d --build

# 4. Aplica las migraciones de la base de datos
docker compose exec backend npx prisma migrate deploy

# 5. (Opcional) Llena la base de datos con datos de prueba
docker compose exec backend npx prisma db seed
```
> ✅ El backend estará corriendo en `http://localhost:3000`.

### **2. Frontend**

El frontend se conecta al backend.

```bash
# 1. Navega a la carpeta del frontend
cd frontend

# 2. Copia las variables de entorno de ejemplo
# (Asegúrate que NEXT_PUBLIC_API_URL apunte al backend)
cp .env.example .env

# 3. Construye y levanta el contenedor
docker compose up -d --build
```
> ✅ El frontend estará disponible en `http://localhost:3001`.

---
Creado con ❤️ por Ricardo Suárez.
