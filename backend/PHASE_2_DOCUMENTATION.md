# 📚 FASE 2: MÓDULO DE NEGOCIOS - DOCUMENTACIÓN COMPLETA

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Tecnologías y Conceptos](#-tecnologías-y-conceptos)
3. [Arquitectura Implementada](#-arquitectura-implementada)
4. [Módulo Business Desarrollado](#-módulo-business-desarrollado)
5. [Conceptos Clave Aprendidos](#-conceptos-clave-aprendidos)
6. [Decisiones de Diseño](#-decisiones-de-diseño)
7. [Endpoints Implementados](#-endpoints-implementados)
8. [Guía de Testing](#-guía-de-testing)
9. [Resultados de Esta Fase](#-resultados-de-esta-fase)
10. [Próximas Fases](#-próximas-fases)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué se construyó?

En esta fase implementamos el **Módulo de Negocios (Business Module)**, el corazón del sistema de reservas. Este módulo permite:

- ✅ Crear negocios (barberías, consultorios, restaurantes, etc.)
- ✅ Listar todos los negocios disponibles
- ✅ Ver detalles completos de un negocio
- ✅ Actualizar información del negocio
- ✅ Eliminar negocios (soft-delete)
- ✅ Gestionar propiedad (ownership) de negocios
- ✅ Control de acceso basado en roles y propiedad

### Características Principales

1. **Authorization Jerárquica**
   - CLIENT: Solo puede ver negocios
   - STAFF: Puede crear y gestionar SUS negocios
   - ADMIN: Puede gestionar TODOS los negocios

2. **Soft-Delete**
   - Los negocios no se borran físicamente
   - Se marcan como inactivos (`isActive: false`)
   - No aparecen en listados públicos

3. **Relaciones Complejas**
   - Business → Owner (1:N)
   - Business → Staff (N:N)
   - Business → Services (1:N)

4. **Validaciones Robustas**
   - DTOs con class-validator
   - Verificación de ownership
   - Manejo de errores específico

### Tiempo estimado de desarrollo

- **Planificación y diseño:** 1 hora
- **Implementación del Service:** 2 horas
- **Implementación del Controller:** 1 hora
- **Testing y correcciones:** 1.5 horas
- **Total:** ~5.5 horas

### Líneas de código aproximadas

- **Service:** ~167 líneas
- **Controller:** ~75 líneas
- **DTOs:** ~40 líneas
- **Module:** ~12 líneas
- **Total:** ~294 líneas

---

## 🛠️ TECNOLOGÍAS Y CONCEPTOS

### Tecnologías Utilizadas

1. **NestJS** - Framework backend
2. **Prisma ORM** - Gestión de base de datos
3. **PostgreSQL** - Base de datos relacional
4. **TypeScript** - Lenguaje de programación
5. **class-validator** - Validación de DTOs
6. **@nestjs/mapped-types** - Transformación de DTOs
7. **JWT** - Autenticación
8. **Guards** - Autorización

### Nuevos Conceptos Aprendidos

1. **Ownership-based Authorization**
2. **Soft-Delete Pattern**
3. **PartialType para DTOs**
4. **Relaciones N:N en Prisma**
5. **Guards Múltiples**
6. **Query Optimization con include**
7. **_count en Prisma**
8. **Orden de rutas en Controllers**

---

## 🏗️ ARQUITECTURA IMPLEMENTADA

### Estructura de Carpetas

```
src/
└── businesses/
    ├── dto/
    │   ├── create-business.dto.ts
    │   └── update-business.dto.ts
    ├── business.controller.ts
    ├── business.service.ts
    └── business.module.ts
```

### Patrón de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Postman)                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Controller (business.controller.ts)        │
│  - Recibe HTTP requests                                 │
│  - Aplica Guards (JWT + Roles)                          │
│  - Valida DTOs                                          │
│  - Extrae user del token                                │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               Service (business.service.ts)             │
│  - Lógica de negocio                                    │
│  - Verificación de ownership                            │
│  - Queries a la BD                                      │
│  - Manejo de errores                                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               PrismaService (Database)                  │
│  - Conexión a PostgreSQL                                │
│  - Ejecución de queries                                 │
│  - Manejo de transacciones                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 MÓDULO BUSINESS DESARROLLADO

### 1. Schema de Prisma

```prisma
model Business {
  id          String   @id @default(uuid())
  name        String
  description String?
  address     String?
  phone       String?
  isActive    Boolean  @default(true)
  ownerId     String   @map("owner_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  owner    User      @relation("BusinessOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  staff    User[]    @relation("BusinessStaff")
  services Service[]

  @@map("businesses")
}
```

**Características del modelo:**
- `id`: UUID generado automáticamente
- `name`: Nombre del negocio (obligatorio)
- `description`, `address`, `phone`: Campos opcionales
- `isActive`: Para soft-delete (default: true)
- `ownerId`: Relación con el usuario propietario
- Timestamps automáticos

**Relaciones:**
- `owner`: 1:N (Un usuario puede tener muchos negocios)
- `staff`: N:N (Un negocio tiene muchos empleados, un empleado puede trabajar en varios negocios)
- `services`: 1:N (Un negocio tiene muchos servicios)

---

### 2. DTOs (Data Transfer Objects)

#### CreateBusinessDto

```typescript
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
```

**Validaciones:**
- `name`: Obligatorio, mínimo 2 caracteres
- `description`, `address`, `phone`: Opcionales
- NO incluye `ownerId` (se obtiene del token JWT)
- NO incluye `isActive` (default en BD)

#### UpdateBusinessDto

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
```

**Características:**
- Todos los campos opcionales
- Mantiene las mismas validaciones cuando el campo está presente
- Usa `PartialType` de `@nestjs/mapped-types`

---

### 3. Business Service

El service implementa **6 métodos** con lógica de negocio completa:

#### Método: `createBusiness`

**Propósito:** Crear un nuevo negocio.

**Parámetros:**
- `createBusinessDto`: Datos del negocio
- `ownerId`: ID del usuario que crea el negocio

**Lógica:**
1. Crea el negocio en la BD
2. Conecta con el usuario owner
3. Incluye información del owner en la respuesta
4. Maneja error si el owner no existe (P2025)

**Código clave:**
```typescript
return await this.prisma.client.business.create({
  data: {
    ...createBusinessDto,
    owner: { connect: { id: ownerId } },
  },
  include: {
    owner: {
      select: { id: true, name: true, email: true }
    }
  }
});
```

---

#### Método: `findAll`

**Propósito:** Listar todos los negocios activos.

**Características:**
- Solo devuelve negocios con `isActive: true`
- Incluye información básica del owner
- Ordenados por fecha de creación (más recientes primero)
- Público (no requiere autenticación)

**Código clave:**
```typescript
return await this.prisma.client.business.findMany({
  where: { isActive: true },
  include: {
    owner: {
      select: { id: true, name: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

---

#### Método: `findOne`

**Propósito:** Obtener un negocio específico con todas sus relaciones.

**Características:**
- Busca por ID
- Incluye: owner, staff, services
- Lanza `NotFoundException` si no existe
- Público (no requiere autenticación)

**Código clave:**
```typescript
const business = await this.prisma.client.business.findUnique({
  where: { id },
  include: {
    owner: { select: { id: true, name: true, email: true } },
    staff: { select: { id: true, name: true, email: true } },
    services: true
  }
});

if (!business) {
  throw new NotFoundException(`Business with ID ${id} not found`);
}

return business;
```

---

#### Método: `findByOwner`

**Propósito:** Listar todos los negocios de un usuario específico.

**Características:**
- Filtra por `ownerId`
- Solo negocios activos
- Incluye count de servicios y staff
- Útil para "Mis Negocios"

**Código clave:**
```typescript
return this.prisma.client.business.findMany({
  where: {
    ownerId,
    isActive: true
  },
  include: {
    services: true,
    _count: {
      select: {
        services: true,
        staff: true
      }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

---

#### Método: `updateBusiness`

**Propósito:** Actualizar información de un negocio.

**Características:**
- Verifica que el negocio existe
- Verifica ownership (solo owner o ADMIN)
- Actualiza solo los campos enviados
- Incluye owner en la respuesta

**Lógica de autorización:**
```typescript
// 1. Verificar que existe
const business = await this.findOne(id);

// 2. Verificar ownership
if (business.ownerId !== userId && userRole !== 'ADMIN') {
  throw new ForbiddenException('You are not the owner of this business');
}

// 3. Actualizar
return await this.prisma.client.business.update({
  where: { id },
  data: updateBusinessDto,
  include: {
    owner: { select: { id: true, name: true, email: true } }
  }
});
```

---

#### Método: `remove`

**Propósito:** Eliminar un negocio (soft-delete).

**Características:**
- NO borra físicamente el registro
- Marca `isActive: false`
- Verifica ownership (solo owner o ADMIN)
- Los negocios inactivos no aparecen en listados

**Lógica:**
```typescript
// 1. Verificar que existe
const business = await this.findOne(id);

// 2. Verificar ownership
if (business.ownerId !== userId && userRole !== 'ADMIN') {
  throw new ForbiddenException('You are not the owner of this business');
}

// 3. Soft-delete
return this.prisma.client.business.update({
  where: { id },
  data: { isActive: false }
});
```

---

### 4. Business Controller

El controller expone **6 endpoints REST** con autorización apropiada:

#### Estructura General

```typescript
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // Endpoints...
}
```

---

#### Endpoint: POST /businesses

**Propósito:** Crear un nuevo negocio.

**Autorización:** Solo STAFF y ADMIN

```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
async create(
  @Body() createBusinessDto: CreateBusinessDto,
  @CurrentUser() user: any,
) {
  return this.businessService.createBusiness(createBusinessDto, user.id);
}
```

**Request:**
```http
POST /businesses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Barbería El Corte Perfecto",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+1234567890"
}
```

**Response: 201 Created**
```json
{
  "id": "uuid-generado",
  "name": "Barbería El Corte Perfecto",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "isActive": true,
  "ownerId": "user-id",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "owner": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### Endpoint: GET /businesses

**Propósito:** Listar todos los negocios activos.

**Autorización:** Público (no requiere autenticación)

```typescript
@Get()
async findAll() {
  return this.businessService.findAll();
}
```

**Request:**
```http
GET /businesses
```

**Response: 200 OK**
```json
[
  {
    "id": "uuid-1",
    "name": "Barbería El Corte Perfecto",
    "description": "La mejor barbería de la ciudad",
    "address": "Calle Principal 123",
    "phone": "+1234567890",
    "isActive": true,
    "ownerId": "user-id",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "owner": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

#### Endpoint: GET /businesses/my-businesses

**Propósito:** Obtener los negocios del usuario autenticado.

**Autorización:** JWT requerido

```typescript
@Get('my-businesses')
@UseGuards(JwtAuthGuard)
async findMyBusinesses(@CurrentUser() user: any) {
  return this.businessService.findByOwner(user.id);
}
```

**⚠️ Importante:** Esta ruta debe ir **ANTES** de `GET /:id` para evitar conflictos.

**Request:**
```http
GET /businesses/my-businesses
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
[
  {
    "id": "uuid-1",
    "name": "Barbería El Corte Perfecto",
    "description": "La mejor barbería de la ciudad",
    "address": "Calle Principal 123",
    "phone": "+1234567890",
    "isActive": true,
    "ownerId": "user-id",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "services": [],
    "_count": {
      "services": 0,
      "staff": 0
    }
  }
]
```

---

#### Endpoint: GET /businesses/:id

**Propósito:** Obtener detalles completos de un negocio.

**Autorización:** Público

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.businessService.findOne(id);
}
```

**Request:**
```http
GET /businesses/uuid-123
```

**Response: 200 OK**
```json
{
  "id": "uuid-123",
  "name": "Barbería El Corte Perfecto",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "isActive": true,
  "ownerId": "user-id",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "owner": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "staff": [],
  "services": []
}
```

---

#### Endpoint: PATCH /businesses/:id

**Propósito:** Actualizar información del negocio.

**Autorización:** Solo el owner o ADMIN

```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
async update(
  @Param('id') id: string,
  @Body() updateBusinessDto: UpdateBusinessDto,
  @CurrentUser() user: any,
) {
  return this.businessService.updateBusiness(
    id,
    updateBusinessDto,
    user.id,
    user.role,
  );
}
```

**Request:**
```http
PATCH /businesses/uuid-123
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Barbería El Corte Perfecto Premium",
  "phone": "+9876543210"
}
```

**Response: 200 OK**
```json
{
  "id": "uuid-123",
  "name": "Barbería El Corte Perfecto Premium",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+9876543210",
  "isActive": true,
  "ownerId": "user-id",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z",
  "owner": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response: 403 Forbidden** (si no es el owner ni ADMIN)
```json
{
  "statusCode": 403,
  "message": "You are not the owner of this business"
}
```

---

#### Endpoint: DELETE /businesses/:id

**Propósito:** Eliminar un negocio (soft-delete).

**Autorización:** Solo el owner o ADMIN

```typescript
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
async remove(
  @Param('id') id: string,
  @CurrentUser() user: any,
) {
  return this.businessService.remove(id, user.id, user.role);
}
```

**Request:**
```http
DELETE /businesses/uuid-123
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "id": "uuid-123",
  "name": "Barbería El Corte Perfecto Premium",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+9876543210",
  "isActive": false,
  "ownerId": "user-id",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

### 5. Business Module

```typescript
import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
```

**Características:**
- Importa `PrismaModule` para acceso a BD
- Registra el controller y service
- Exporta el service (otros módulos pueden usarlo)

---

## 📚 CONCEPTOS CLAVE APRENDIDOS

### 1. Ownership-Based Authorization

**¿Qué es?**
Validar que un recurso pertenece al usuario que intenta modificarlo.

**Diferencia con Role-Based:**
- **Role-Based:** "¿Eres ADMIN?" → Basado en el ROL
- **Ownership-Based:** "¿Este negocio es tuyo?" → Basado en PROPIEDAD

**Ejemplo en código:**
```typescript
if (business.ownerId !== userId && userRole !== 'ADMIN') {
  throw new ForbiddenException('You are not the owner');
}
```

**Jerarquía:**
1. Owner del recurso → Puede modificar SU recurso
2. ADMIN → Puede modificar CUALQUIER recurso

**Analogía del mundo real:**
- En Instagram: Solo puedes editar TUS fotos (ownership)
- Pero un admin de Instagram puede editar cualquier foto (role)

---

### 2. Soft-Delete Pattern

**¿Qué es?**
No borrar físicamente registros de la BD, sino marcarlos como "inactivos".

**Ventajas:**
- ✅ Recuperación de datos
- ✅ Auditoría e historial
- ✅ Mantiene integridad referencial
- ✅ Análisis de datos eliminados

**Desventajas:**
- ⚠️ La BD crece más
- ⚠️ Queries más complejas (siempre filtrar por isActive)

**Implementación:**
```typescript
// Campo en el modelo
isActive Boolean @default(true)

// "Eliminar"
await prisma.business.update({
  where: { id },
  data: { isActive: false }
});

// Listar solo activos
await prisma.business.findMany({
  where: { isActive: true }
});
```

---

### 3. PartialType para DTOs

**¿Qué es?**
Utilidad de NestJS que toma un DTO y crea una versión donde todos los campos son opcionales.

**Uso:**
```typescript
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
```

**Resultado:**
- Si `CreateBusinessDto` tiene `name` obligatorio
- `UpdateBusinessDto` tiene `name` opcional
- Mantiene todas las validaciones cuando el campo está presente

**Ventajas:**
- ✅ DRY (Don't Repeat Yourself)
- ✅ Menos código
- ✅ Cambios en CreateDto se reflejan automáticamente

---

### 4. Relaciones N:N en Prisma

**¿Qué es?**
Relación muchos-a-muchos (Many-to-Many).

**Ejemplo en nuestro sistema:**
- Un negocio puede tener **muchos** empleados (staff)
- Un empleado puede trabajar en **muchos** negocios

**Definición en Prisma:**
```prisma
model Business {
  staff User[] @relation("BusinessStaff")
}

model User {
  staffBusinesses Business[] @relation("BusinessStaff")
}
```

**Prisma crea automáticamente una tabla intermedia:**
```sql
CREATE TABLE "_BusinessStaff" (
  "A" uuid NOT NULL REFERENCES "businesses"("id"),
  "B" uuid NOT NULL REFERENCES "users"("id")
);
```

---

### 5. Guards Múltiples

**¿Qué son?**
Aplicar varios guards en un mismo endpoint que se ejecutan en orden.

**Ejemplo:**
```typescript
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)  // 2 guards
@Roles('ADMIN', 'STAFF')
async update(...) { }
```

**Flujo de ejecución:**
```
Request
  ↓
JwtAuthGuard (¿Token válido?)
  ↓ ✅
RolesGuard (¿Rol permitido?)
  ↓ ✅
Endpoint se ejecuta
```

Si cualquier guard falla, el endpoint no se ejecuta.

---

### 6. Query Optimization con `include`

**¿Qué es?**
Prisma permite cargar relaciones en una sola query (evita N+1 queries).

**Sin include (N+1 problem):**
```typescript
const businesses = await prisma.business.findMany(); // 1 query
// Para cada business, hacer otra query para obtener el owner
for (const business of businesses) {
  const owner = await prisma.user.findUnique({ where: { id: business.ownerId } });
}
// Total: 1 + N queries
```

**Con include (optimizado):**
```typescript
const businesses = await prisma.business.findMany({
  include: {
    owner: true
  }
});
// Total: 1 query con JOIN
```

**Select específico:**
```typescript
include: {
  owner: {
    select: {
      id: true,
      name: true,
      email: true
      // NO incluir password
    }
  }
}
```

---

### 7. _count en Prisma

**¿Qué es?**
Contar registros relacionados sin cargarlos todos.

**Uso:**
```typescript
const businesses = await prisma.business.findMany({
  include: {
    _count: {
      select: {
        services: true,  // Cuenta cuántos servicios
        staff: true      // Cuenta cuántos empleados
      }
    }
  }
});
```

**Respuesta:**
```json
{
  "id": "uuid",
  "name": "Mi Negocio",
  "_count": {
    "services": 5,
    "staff": 3
  }
}
```

**Ventaja:** Eficiente, no carga todos los registros relacionados.

---

### 8. Orden de Rutas en Controllers

**⚠️ Problema:**
```typescript
@Get(':id')           // Captura TODO, incluso "my-businesses"
async findOne() { }

@Get('my-businesses') // Nunca se ejecuta
async findMy() { }
```

**✅ Solución:**
```typescript
@Get('my-businesses') // Ruta específica PRIMERO
async findMy() { }

@Get(':id')           // Ruta con parámetro DESPUÉS
async findOne() { }
```

**Regla:** Rutas específicas **antes** que rutas con parámetros.

---

## 🎨 DECISIONES DE DISEÑO

### Decisión 1: ¿Quién puede crear negocios?

**Opciones evaluadas:**
- A) Cualquiera puede crear (auto-upgrade a STAFF)
- B) Solo STAFF/ADMIN pueden crear

**Decisión tomada:** Opción B (Solo STAFF/ADMIN)

**Razones:**
- ✅ Mayor control y moderación
- ✅ Evita spam de negocios falsos
- ✅ Modelo de negocio más profesional
- ✅ Roles más claros y separados

**Implementación:**
```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
async create(...) { }
```

---

### Decisión 2: ¿Borrado físico o soft-delete?

**Opciones evaluadas:**
- A) Borrado físico (DELETE FROM businesses)
- B) Soft-delete (UPDATE isActive = false)

**Decisión tomada:** Opción B (Soft-delete)

**Razones:**
- ✅ Recuperación de datos accidental
- ✅ Auditoría e historial
- ✅ Mantiene relaciones intactas
- ✅ Análisis de datos

**Implementación:**
```typescript
// Agregar campo
isActive Boolean @default(true)

// "Eliminar"
data: { isActive: false }

// Listar solo activos
where: { isActive: true }
```

---

### Decisión 3: ¿ADMINs pueden editar cualquier negocio?

**Opciones evaluadas:**
- A) Solo el owner puede editar (nadie más)
- B) Owner O ADMIN pueden editar

**Decisión tomada:** Opción B (Owner O ADMIN)

**Razones:**
- ✅ ADMINs necesitan moderar contenido
- ✅ Soporte al cliente (ayudar a actualizar)
- ✅ Práctica estándar en aplicaciones web
- ✅ Flexibilidad operativa

**Implementación:**
```typescript
if (business.ownerId !== userId && userRole !== 'ADMIN') {
  throw new ForbiddenException('You are not the owner');
}
```

---

### Decisión 4: ¿Endpoints públicos o privados?

**Decisión tomada:**

| Endpoint | Acceso | Razón |
|----------|--------|-------|
| GET /businesses | Público | Catálogo visible para todos |
| GET /businesses/:id | Público | Detalles visibles para todos |
| GET /my-businesses | Autenticado | Datos personales |
| POST /businesses | STAFF/ADMIN | Control de quién crea |
| PATCH /businesses/:id | Owner/ADMIN | Solo quien gestiona |
| DELETE /businesses/:id | Owner/ADMIN | Solo quien gestiona |

**Razón:** Balance entre transparencia (negocios públicos) y seguridad (gestión privada).

---

### Decisión 5: ¿Nombres en singular o plural?

**Decisión tomada:**
- Archivos: `business.controller.ts`, `business.service.ts` (singular)
- Clases: `BusinessController`, `BusinessService` (singular)
- Ruta: `@Controller('businesses')` (plural)

**Razón:** Convención estándar de NestJS y REST APIs.

---

## 📊 ENDPOINTS IMPLEMENTADOS

### Tabla Resumen

| Método | Ruta | Descripción | Auth | Roles | Ownership |
|--------|------|-------------|------|-------|-----------|
| POST | `/businesses` | Crear negocio | ✅ | STAFF, ADMIN | - |
| GET | `/businesses` | Listar todos | ❌ | - | - |
| GET | `/businesses/my-businesses` | Mis negocios | ✅ | Todos | ✅ |
| GET | `/businesses/:id` | Ver detalle | ❌ | - | - |
| PATCH | `/businesses/:id` | Actualizar | ✅ | STAFF, ADMIN | ✅ |
| DELETE | `/businesses/:id` | Eliminar | ✅ | STAFF, ADMIN | ✅ |

---

### Matriz de Permisos

| Acción | CLIENT | STAFF (owner) | STAFF (no owner) | ADMIN |
|--------|--------|---------------|------------------|-------|
| Ver todos los negocios | ✅ | ✅ | ✅ | ✅ |
| Ver detalle de negocio | ✅ | ✅ | ✅ | ✅ |
| Ver mis negocios | ✅ (vacío) | ✅ | ✅ | ✅ |
| Crear negocio | ❌ | ✅ | ✅ | ✅ |
| Editar su negocio | ❌ | ✅ | ❌ | ✅ |
| Editar negocio ajeno | ❌ | ❌ | ❌ | ✅ |
| Eliminar su negocio | ❌ | ✅ | ❌ | ✅ |
| Eliminar negocio ajeno | ❌ | ❌ | ❌ | ✅ |

---

## 🧪 GUÍA DE TESTING

### Preparación

**1. Crear usuarios de prueba:**

```http
POST /auth/register
{
  "email": "staff1@test.com",
  "password": "Password123",
  "name": "Staff One"
}
```

**2. Actualizar rol a STAFF (como ADMIN):**

```http
PATCH /users/{id}/role
Authorization: Bearer <admin-token>
{
  "role": "STAFF"
}
```

**3. Obtener tokens:**

```http
POST /auth/login
{
  "email": "staff1@test.com",
  "password": "Password123"
}
```

---

### Test Suite Completa

#### ✅ TEST 1: Crear negocio como STAFF

```http
POST /businesses
Authorization: Bearer <staff-token>
Content-Type: application/json

{
  "name": "Barbería El Corte Perfecto",
  "description": "La mejor barbería de la ciudad",
  "address": "Calle Principal 123",
  "phone": "+1234567890"
}
```

**Esperado:** 201 Created con el negocio creado

---

#### ❌ TEST 2: Crear negocio como CLIENT

```http
POST /businesses
Authorization: Bearer <client-token>
Content-Type: application/json

{
  "name": "Test Business"
}
```

**Esperado:** 403 Forbidden

---

#### ✅ TEST 3: Listar todos los negocios (público)

```http
GET /businesses
```

**Esperado:** 200 OK con array de negocios activos

---

#### ✅ TEST 4: Ver mis negocios

```http
GET /businesses/my-businesses
Authorization: Bearer <staff-token>
```

**Esperado:** 200 OK con negocios del usuario

---

#### ✅ TEST 5: Ver detalle de un negocio (público)

```http
GET /businesses/{id}
```

**Esperado:** 200 OK con negocio completo (owner, staff, services)

---

#### ❌ TEST 6: Ver negocio inexistente

```http
GET /businesses/uuid-fake-123
```

**Esperado:** 404 Not Found

---

#### ✅ TEST 7: Actualizar su propio negocio

```http
PATCH /businesses/{id}
Authorization: Bearer <owner-token>
Content-Type: application/json

{
  "name": "Barbería El Corte Perfecto Premium"
}
```

**Esperado:** 200 OK con negocio actualizado

---

#### ❌ TEST 8: Actualizar negocio ajeno (como STAFF)

```http
PATCH /businesses/{id-de-otro}
Authorization: Bearer <staff-token>
Content-Type: application/json

{
  "name": "Intento de hack"
}
```

**Esperado:** 403 Forbidden con mensaje "You are not the owner"

---

#### ✅ TEST 9: Actualizar cualquier negocio (como ADMIN)

```http
PATCH /businesses/{id-de-cualquiera}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Actualizado por admin"
}
```

**Esperado:** 200 OK (ADMIN puede editar cualquier negocio)

---

#### ❌ TEST 10: Crear negocio sin autenticación

```http
POST /businesses
Content-Type: application/json

{
  "name": "Test Business"
}
```

**Esperado:** 401 Unauthorized

---

#### ❌ TEST 11: Crear negocio con datos inválidos

```http
POST /businesses
Authorization: Bearer <staff-token>
Content-Type: application/json

{
  "name": "A"
}
```

**Esperado:** 400 Bad Request con mensaje "name must be longer than or equal to 2 characters"

---

#### ✅ TEST 12: Eliminar su propio negocio

```http
DELETE /businesses/{id}
Authorization: Bearer <owner-token>
```

**Esperado:** 200 OK con negocio marcado `isActive: false`

---

#### ✅ TEST 13: Verificar que negocio eliminado no aparece en listado

```http
GET /businesses
```

**Esperado:** 200 OK, el negocio eliminado NO debe aparecer en el array

---

#### ✅ TEST 14: Negocio eliminado todavía accesible por ID

```http
GET /businesses/{id-eliminado}
```

**Esperado:** 200 OK con el negocio (aunque esté inactivo)

**Nota:** Si quieres que no sea accesible, puedes agregar filtro `isActive: true` en `findOne`.

---

## 🎊 RESULTADOS DE ESTA FASE

### Métricas de Aprendizaje

**Conceptos nuevos dominados:**
1. ✅ Ownership-based authorization
2. ✅ Soft-delete pattern
3. ✅ PartialType para DTOs
4. ✅ Relaciones N:N en Prisma
5. ✅ Guards múltiples
6. ✅ Query optimization con include
7. ✅ _count en Prisma
8. ✅ Orden de rutas en controllers
9. ✅ Jerarquía de permisos (CLIENT < STAFF < ADMIN)
10. ✅ Diseño de APIs RESTful

**Habilidades prácticas:**
1. ✅ Crear módulos completos en NestJS
2. ✅ Diseñar sistemas de autorización complejos
3. ✅ Manejar relaciones en Prisma
4. ✅ Optimizar queries a base de datos
5. ✅ Implementar soft-delete
6. ✅ Testing de APIs con diferentes roles

---

### Código Producido

**Archivos creados:**
- `business.service.ts` (~167 líneas)
- `business.controller.ts` (~75 líneas)
- `create-business.dto.ts` (~21 líneas)
- `update-business.dto.ts` (~5 líneas)
- `business.module.ts` (~12 líneas)

**Total:** ~280 líneas de código

**Migración de base de datos:**
- Agregado campo `phone` a Business
- Agregado campo `isActive` a Business

---

### Tiempo Invertido

**Planificación:** ~1 hora
- Diseño de arquitectura
- Decisiones de autorización
- Modelado de relaciones

**Implementación:**
- DTOs: ~30 minutos
- Service: ~2 horas
- Controller: ~1 hora
- Module y configuración: ~30 minutos

**Testing y correcciones:** ~1.5 horas
- Pruebas de endpoints
- Corrección de errores
- Ajustes de permisos

**Total:** ~5.5 horas

---

### Funcionalidades Implementadas

✅ CRUD completo de negocios  
✅ Autorización por roles (ADMIN, STAFF, CLIENT)  
✅ Autorización por propiedad (ownership)  
✅ Soft-delete de negocios  
✅ Listado público de negocios  
✅ Listado privado "Mis negocios"  
✅ Validaciones robustas con DTOs  
✅ Manejo de errores específico  
✅ Relaciones con usuarios (owner, staff)  
✅ Queries optimizadas con include  

---

## 🚀 PRÓXIMAS FASES

### Fase 3: Módulo de Servicios (Services)

**¿Qué construiremos?**
- Servicios que ofrece cada negocio
- Ejemplo: Barbería → Corte ($10, 30min), Barba ($5, 15min), Tinte ($20, 1hr)

**Características:**
- CRUD de servicios bajo cada negocio
- Validación de precios y duraciones
- Solo el owner del negocio puede gestionar sus servicios
- Relación: Business (1) → Services (N)

**Endpoints estimados:**
```
POST   /businesses/:businessId/services
GET    /businesses/:businessId/services
GET    /services/:id
PATCH  /services/:id
DELETE /services/:id
```

**Conceptos nuevos:**
- Nested routes (rutas anidadas)
- Validación de números (price, duration)
- Transform decorators
- Validación de relaciones padre-hijo

---

### Fase 4: Módulo de Reservas (Bookings)

**¿Qué construiremos?**
- Clientes hacen reservas de servicios
- Validar disponibilidad de fechas/horarios
- Estados: PENDING, CONFIRMED, CANCELLED, COMPLETED
- Notificaciones (opcional)

**Características:**
- CRUD de reservas
- Validación de disponibilidad
- Transiciones de estado
- Filtros por fecha, estado, negocio, cliente
- Relación: Service (1) → Bookings (N)
- Relación: User (1) → Bookings (N)

**Endpoints estimados:**
```
POST   /bookings
GET    /bookings
GET    /bookings/:id
PATCH  /bookings/:id/status
DELETE /bookings/:id
GET    /businesses/:id/bookings
GET    /users/:id/bookings
```

**Conceptos nuevos:**
- Validación de disponibilidad
- State machines (transiciones de estado)
- Queries complejas con múltiples filtros
- Aggregations (reportes)

---

### Fase 5: Features Avanzadas

**Gestión de Staff:**
- Asignar empleados a negocios (relación N:N)
- Endpoints: `POST /businesses/:id/staff`, `DELETE /businesses/:id/staff/:userId`

**Horarios de Operación:**
- Definir horarios de apertura/cierre por día
- Validar reservas dentro del horario

**Disponibilidad de Staff:**
- Staff puede definir su disponibilidad
- Bookings asignados a staff específico

**Imágenes:**
- Subir logo del negocio
- Galería de imágenes
- Integración con S3 o Cloudinary

**Búsqueda y Filtros:**
- Buscar negocios por nombre, ciudad, categoría
- Filtrar servicios por precio, duración
- Paginación de resultados

---

### Fase 6: Frontend (React/Next.js)

**Páginas:**
- Landing page pública
- Catálogo de negocios
- Detalle de negocio con servicios
- Sistema de reservas
- Dashboard de owner
- Dashboard de admin
- Perfil de usuario

**Tecnologías:**
- React/Next.js
- TailwindCSS
- React Query
- Zustand (state management)
- React Hook Form

---

### Fase 7: DevOps y Deploy

**Infraestructura:**
- Docker Compose para desarrollo
- CI/CD con GitHub Actions
- Deploy en Railway/Render/AWS
- Base de datos en producción
- Variables de entorno seguras

**Seguridad:**
- Rate limiting
- CORS configurado
- Helmet.js
- Validación de inputs
- Sanitización de datos

**Monitoreo:**
- Logs estructurados
- Error tracking (Sentry)
- Métricas de performance
- Health checks

---

## 📝 CONCLUSIONES DE FASE 2

### Lo que Funcionó Bien

1. **Metodología de Enseñanza Guiada**
   - Explicar conceptos antes de implementar
   - Guiar paso a paso sin escribir código directamente
   - Revisar y corregir con propósito educativo
   - Resultado: Comprensión profunda vs. copiar-pegar

2. **Arquitectura Modular**
   - Cada módulo independiente y cohesivo
   - Fácil de mantener y extender
   - Reutilización del PrismaModule
   - Guards y decoradores compartidos

3. **Decisiones de Diseño Documentadas**
   - Evaluar opciones antes de implementar
   - Documentar razones de las decisiones
   - Facilita futuras modificaciones

4. **Testing Exhaustivo**
   - Probar casos exitosos y de error
   - Verificar permisos con diferentes roles
   - Detectar problemas de ownership tempranamente

---

### Lecciones Aprendidas

1. **Ownership es tan importante como Roles**
   - No basta con validar el rol
   - Verificar que el usuario sea dueño del recurso
   - Combinar ambas validaciones

2. **Orden de Rutas Importa**
   - Rutas específicas antes de rutas con parámetros
   - `my-businesses` debe ir antes de `:id`
   - Error común que puede pasar desapercibido

3. **Soft-Delete desde el Inicio**
   - Más fácil implementar desde el principio
   - Agregar después requiere migración compleja
   - Siempre filtrar por `isActive` en queries

4. **PartialType Simplifica DTOs**
   - No duplicar código entre Create y Update
   - Cambios en CreateDto se propagan automáticamente
   - Instalar `@nestjs/mapped-types` al inicio

5. **Include vs. Select**
   - `include: true` trae todos los campos
   - `select: { ... }` solo campos específicos
   - NUNCA incluir passwords en respuestas

6. **Guards Múltiples Ejecutan en Orden**
   - `@UseGuards(JwtAuthGuard, RolesGuard)`
   - Primero valida JWT, luego roles
   - Si uno falla, los siguientes no se ejecutan

7. **Try-Catch No Siempre Necesario**
   - `findUnique` no lanza error, retorna `null`
   - `findMany` no lanza error, retorna `[]`
   - Solo `create`, `update`, `delete` pueden lanzar errores Prisma

8. **Prisma Client Regeneración Manual**
   - Después de cambios en schema, ejecutar `npx prisma generate`
   - Prisma 7 no siempre regenera automáticamente
   - Borrar `src/generated` si hay problemas

---

### Desafíos Enfrentados y Resueltos

1. **Campo `isActive` no reconocido**
   - Causa: Prisma Client desactualizado
   - Solución: `npx prisma generate`

2. **CLIENT podía crear pero no editar**
   - Causa: Falta de `@Roles()` en POST
   - Solución: Agregar guards de roles

3. **ADMIN editaba cualquier negocio**
   - Causa: Confusión sobre si es bug o feature
   - Solución: Explicar que es comportamiento esperado

4. **Error en import de Controller**
   - Causa: Archivo `businesses.controller.ts` pero clase `BusinessController`
   - Solución: Consistencia en nombres (singular)

5. **Regenerar Prisma en Windows**
   - Causa: Comando `rm -rf` no funciona en PowerShell
   - Solución: `Remove-Item -Recurse -Force`

---

### Mejoras Futuras Identificadas

1. **Pagination**
   - `findAll()` y `findByOwner()` deberían paginar
   - Agregar parámetros `skip`, `take`
   - Devolver metadata (total, pages)

2. **Búsqueda y Filtros**
   - Buscar por nombre, ciudad, categoría
   - Filtrar por `isActive`, `ownerId`
   - Ordenar por diferentes campos

3. **Validación de Teléfono**
   - Regex para formato válido
   - Librería `libphonenumber-js`

4. **Swagger Documentation**
   - Agregar decoradores `@ApiTags`, `@ApiOperation`
   - Generar documentación interactiva
   - Facilita testing y compartir API

5. **Tests Automatizados**
   - Tests unitarios del Service
   - Tests e2e del Controller
   - Coverage mínimo 80%

6. **Categorías de Negocios**
   - Enum: BARBERSHOP, RESTAURANT, MEDICAL, etc.
   - Filtrar por categoría
   - Iconos por categoría en frontend

7. **Imágenes**
   - Logo del negocio
   - Galería de fotos
   - Integración con storage cloud

8. **Geolocalización**
   - Coordenadas lat/lng
   - Búsqueda por proximidad
   - Integración con Google Maps

---

## 🏆 LOGRO DESBLOQUEADO

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🎉 FASE 2 COMPLETADA CON ÉXITO 🎉               ║
║                                                            ║
║              MÓDULO DE NEGOCIOS IMPLEMENTADO               ║
║                                                            ║
║  ✅ Schema de Prisma con relaciones complejas              ║
║  ✅ 2 DTOs con validaciones                                ║
║  ✅ Service con 6 métodos                                  ║
║  ✅ Controller con 6 endpoints REST                        ║
║  ✅ Authorization por roles y ownership                    ║
║  ✅ Soft-delete implementado                               ║
║  ✅ Testing completo                                       ║
║                                                            ║
║  Nuevas habilidades desbloqueadas:                         ║
║  🔓 Ownership-based authorization                          ║
║  🔓 Soft-delete pattern                                    ║
║  🔓 Relaciones N:N en Prisma                               ║
║  🔓 Guards múltiples                                       ║
║  🔓 Query optimization                                     ║
║                                                            ║
║            ¡Listo para la Fase 3: Services!               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

**Siguiente paso:** Implementar el Módulo de Servicios (Services) para que los negocios puedan ofrecer sus servicios a los clientes.

**Fecha de completación:** [Tu fecha aquí]

**Desarrollador:** [Tu nombre aquí]

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [class-validator](https://github.com/typestack/class-validator)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Conceptos para Profundizar

- **Authorization Patterns:** RBAC, ABAC, ReBAC
- **Soft Delete vs Hard Delete:** Trade-offs y casos de uso
- **API Design:** REST principles, resource naming
- **Database Indexing:** Performance optimization
- **N+1 Query Problem:** Cómo evitarlo con ORMs

### Artículos Recomendados

- [NestJS Authentication & Authorization](https://docs.nestjs.com/security/authentication)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [REST API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

---

**¡Felicidades por completar la Fase 2!** 🚀