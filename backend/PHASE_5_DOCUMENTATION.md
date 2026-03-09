# 📚 FASE 5: MÓDULO DE RESERVAS (BOOKINGS) - DOCUMENTACIÓN COMPLETA

**Proyecto:** Sistema de Reservas para Negocios  
**Fase:** 5 de 7  
**Fecha de completación:** Febrero 2026  
**Tiempo invertido:** ~10 horas  
**Líneas de código:** ~685 líneas

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Arquitectura del Módulo](#-arquitectura-del-módulo)
3. [Componentes Implementados](#-componentes-implementados)
4. [Conceptos Clave](#-conceptos-clave)
5. [Flujos del Sistema](#-flujos-del-sistema)
6. [Endpoints y Permisos](#-endpoints-y-permisos)
7. [Testing Realizado](#-testing-realizado)
8. [Resultados](#-resultados)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué se construyó?

El **módulo de reservas (Bookings)** es el corazón del sistema. Permite a los clientes reservar servicios de negocios en fechas/horas específicas, con validación automática de disponibilidad y gestión de estados.

### Funcionalidades principales

- ✅ **Sistema completo de reservas** - CRUD con validaciones complejas
- ✅ **Validación de disponibilidad** - Detección inteligente de conflictos de horarios
- ✅ **Máquina de estados** - Control de transiciones (PENDING → CONFIRMED → COMPLETED)
- ✅ **Autorización multi-nivel** - Permisos diferenciados por rol y ownership
- ✅ **Cálculo automático** - EndTime calculado según duración del servicio
- ✅ **Paginación y filtros** - Búsqueda por estado, fechas, con paginación

### Tiempo y Métricas

- **Tiempo total:** ~10 horas
- **Archivos creados:** 8 (DTOs, Service, Controller, Module)
- **Líneas de código:** ~685
- **Endpoints:** 8 REST APIs
- **Tests manuales:** 18 (todos exitosos)

---

## 🏗️ ARQUITECTURA DEL MÓDULO

### Estructura de Archivos

```
src/bookings/
  ├── dto/
  │   ├── create-booking.dto.ts      - DTO para crear reserva
  │   ├── update-booking.dto.ts      - DTO para modificar (solo PENDING)
  │   ├── change-status.dto.ts       - DTO para cambiar estado (Owner/Admin)
  │   ├── filter-booking.dto.ts      - DTO para filtros y paginación
  │   └── index.ts                   - Exportaciones
  ├── bookings.module.ts             - Configuración del módulo
  ├── bookings.service.ts            - 9 métodos de lógica de negocio
  └── bookings.controller.ts         - 8 endpoints REST
```

### Schema de Base de Datos

**Modelo Booking:**
- `id` (UUID)
- `startTime` (DateTime) - Inicio de la reserva
- `endTime` (DateTime) - Fin calculado automáticamente
- `status` (Enum) - PENDING, CONFIRMED, CANCELLED, COMPLETED
- `notes` (String opcional)
- `userId` (FK a User) - Cliente que reserva
- `serviceId` (FK a Service) - Servicio reservado
- Timestamps: `createdAt`, `updatedAt`

**Relaciones:**
- Booking → User (N:1)
- Booking → Service (N:1)
- Service → Business → Owner

---

## 📦 COMPONENTES IMPLEMENTADOS

### DTOs (Data Transfer Objects)

**1. CreateBookingDto**
- `serviceId`: ID del servicio a reservar
- `startTime`: Fecha/hora de inicio (formato ISO)
- `notes`: Notas opcionales del cliente
- Validaciones: @IsString, @IsDateString, @IsOptional

**2. UpdateBookingDto**
- Hereda de CreateBookingDto (PartialType)
- Permite modificar startTime y notes
- Solo aplicable a reservas en estado PENDING

**3. ChangeStatusDto**
- `status`: Nuevo estado (validado con @IsEnum)
- Solo permite transiciones válidas según state machine

**4. FilterBookingDto**
- Extiende PaginationDto (page, limit)
- `status`: Filtrar por estado
- `startDate`, `endDate`: Rango de fechas

---

### BookingsService (9 métodos)

**1. create(dto, userId)**
- Verifica que el servicio existe y el negocio está activo
- Calcula `endTime` automáticamente (startTime + service.duration)
- Valida disponibilidad (llama a checkAvailability)
- Crea la reserva con estado PENDING

**2. findAll(filterDto)**
- Lista todas las reservas (solo ADMIN)
- Soporta filtros: status, startDate, endDate
- Paginación con skip/take

**3. findMyBookings(userId, filterDto)**
- Lista reservas del usuario autenticado
- Filtros opcionales por estado y fechas
- Paginación

**4. findBusinessBookings(businessId, userId, userRole, filterDto)**
- Lista reservas de todos los servicios de un negocio
- Valida ownership (owner del negocio o ADMIN)
- Obtiene IDs de servicios del negocio
- Filtra reservas por esos serviceIds

**5. findOne(id)**
- Obtiene detalle completo de una reserva
- Include: user, service, business
- Usado internamente por otros métodos

**6. update(id, dto, userId)**
- Valida ownership (solo dueño de la reserva)
- Solo permite modificar si status = PENDING
- Si cambia startTime, recalcula endTime
- Valida disponibilidad del nuevo horario

**7. changeStatus(id, dto, userId, userRole)**
- Solo owner del negocio o ADMIN
- Valida transiciones según state machine
- Estados finales (COMPLETED, CANCELLED) no se pueden cambiar

**8. cancel(id, userId, userRole)**
- Puede cancelar: cliente, owner del negocio, o ADMIN
- No permite cancelar si ya está CANCELLED o COMPLETED
- Cambia status a CANCELLED (soft-delete conceptual)

**9. checkAvailability(serviceId, startTime, endTime, excludeBookingId?) [PRIVATE]**
- Valida que no sea en el pasado
- Busca conflictos con reservas existentes (PENDING/CONFIRMED)
- 3 casos de conflicto detectados con operadores OR
- Excluye booking actual si es update

---

### BookingsController (8 endpoints)

**Orden de rutas (crítico para funcionamiento):**
1. `@Post()` - Crear reserva
2. `@Get()` - Listar todas (ADMIN)
3. `@Get('my-bookings')` - Mis reservas (específica antes de :id)
4. `@Get('businesses/:businessId')` - Reservas del negocio
5. `@Get(':id')` - Ver detalle (genérica al final)
6. `@Patch(':id/status')` - Cambiar estado (específica antes de :id)
7. `@Patch(':id')` - Modificar reserva
8. `@Delete(':id')` - Cancelar

**Guards aplicados:**
- `@UseGuards(JwtAuthGuard, RolesGuard)` a nivel de clase
- `@Roles('ADMIN')` solo en GET /bookings

---

## 🎓 CONCEPTOS CLAVE

### 1. Validación de Disponibilidad (Algoritmo de Conflictos)

**Problema a resolver:**
¿Cómo detectar si dos reservas se superponen?

**Solución con 3 casos:**

**Caso 1: Nueva empieza durante existente**
- Existente: 10:00 - 11:00
- Nueva: 10:30 - 11:30 ❌
- Query: `startTime <= 10:30 AND endTime > 10:30`

**Caso 2: Nueva termina durante existente**
- Existente: 10:00 - 11:00
- Nueva: 09:30 - 10:30 ❌
- Query: `startTime < 10:30 AND endTime >= 10:30`

**Caso 3: Nueva envuelve existente**
- Existente: 10:00 - 11:00
- Nueva: 09:30 - 11:30 ❌
- Query: `startTime >= 09:30 AND endTime <= 11:30`

**Sin conflicto:**
- Nueva antes: 09:00 - 10:00 ✅
- Nueva después: 11:00 - 12:00 ✅

**Implementación:**
Usa `OR` en Prisma para combinar los 3 casos. Si encuentra alguna reserva, lanza ConflictException.

---

### 2. State Machine (Máquina de Estados)

**Estados posibles:**
- PENDING (inicial)
- CONFIRMED
- CANCELLED
- COMPLETED

**Transiciones válidas:**
```
PENDING → CONFIRMED ✅
PENDING → CANCELLED ✅
CONFIRMED → COMPLETED ✅
CONFIRMED → CANCELLED ✅
COMPLETED → (ninguno) ❌
CANCELLED → (ninguno) ❌
```

**Implementación:**
```javascript
validTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED']
}
```

Si el estado actual está en COMPLETED o CANCELLED, rechaza cambio.
Si la transición no está en el array, rechaza con BadRequestException.

---

### 3. Cálculo Automático de EndTime

**Por qué es necesario:**
El cliente solo especifica `startTime`. El sistema calcula `endTime` basándose en la duración del servicio.

**Implementación:**
```javascript
startTime = new Date("2024-03-15T10:00:00Z")
duration = 60 (minutos del servicio)

endTime = new Date(startTime)
endTime.setMinutes(endTime.getMinutes() + duration)
// Resultado: "2024-03-15T11:00:00Z"
```

**Ventaja:** El cliente no necesita calcular, reduce errores.

---

### 4. Ownership Validation Multi-Nivel

**Tres niveles de permisos:**

**Cliente (USER):**
- Crear reservas
- Ver solo SUS reservas
- Modificar solo SUS reservas (solo si PENDING)
- Cancelar SUS reservas

**Owner del Negocio (STAFF):**
- Ver reservas de SU negocio
- Cambiar estado de reservas de SU negocio
- Cancelar reservas de SU negocio

**Admin (ADMIN):**
- Acceso total a todo

**Implementación:**
Cada método del service valida:
```javascript
if (booking.userId !== userId && userRole !== 'ADMIN') {
  throw ForbiddenException
}
```

O para owners:
```javascript
if (business.ownerId !== userId && userRole !== 'ADMIN') {
  throw ForbiddenException
}
```

---

### 5. Queries con OR en Prisma

Para la validación de disponibilidad usamos:
```javascript
where: {
  serviceId,
  status: { in: ['PENDING', 'CONFIRMED'] },
  OR: [
    { caso1 },
    { caso2 },
    { caso3 }
  ]
}
```

El `OR` permite buscar reservas que cumplan CUALQUIERA de los 3 casos de conflicto.

---

### 6. Operador `in` para Múltiples IDs

En `findBusinessBookings`, necesitamos reservas de TODOS los servicios del negocio:
```javascript
serviceIds = ['service-1', 'service-2', 'service-3']

where: {
  serviceId: { in: serviceIds }
}
```

Equivale a SQL: `WHERE service_id IN ('service-1', 'service-2', 'service-3')`

---

### 7. Fix Crítico: Decorador @CurrentUser

**Problema inicial:**
El decorador devolvía el objeto user completo, causando error:
```
Expected String, provided Object
```

**Solución:**
Modificar el decorador para extraer campos específicos:
```typescript
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    return data ? user?.[data] : user;
  },
);
```

Ahora `@CurrentUser('id')` devuelve solo el string del ID.

---

## 🔄 FLUJOS DEL SISTEMA

### FLUJO 1: Cliente crea una reserva

```
1. Cliente → POST /bookings
   Body: { serviceId, startTime, notes }
   Header: Bearer token

2. Controller extrae userId del token
   @CurrentUser('id')

3. Service.create(dto, userId)
   a. Busca el service por ID
   b. Verifica que existe
   c. Verifica que business.isActive = true
   d. Calcula endTime = startTime + service.duration
   e. Llama a checkAvailability(serviceId, startTime, endTime)
      - Valida no sea pasado
      - Busca conflictos con query OR
      - Si hay conflictos → 409 Conflict
   f. Crea booking con status = PENDING
   g. Devuelve booking con includes (user, service, business)

4. Response: 201 Created con booking completo
```

**Validaciones en cada paso:**
- ✅ Token JWT válido
- ✅ Service existe
- ✅ Business activo
- ✅ Horario disponible
- ✅ No es en el pasado

---

### FLUJO 2: Owner confirma una reserva

```
1. Owner → PATCH /bookings/:id/status
   Body: { status: "CONFIRMED" }
   Header: Bearer token (owner)

2. Controller extrae userId y userRole
   @CurrentUser('id'), @CurrentUser('role')

3. Service.changeStatus(id, dto, userId, userRole)
   a. Busca booking con findOne(id)
      - Include service → business → ownerId
   b. Verifica ownership:
      if (business.ownerId !== userId && role !== 'ADMIN')
         → 403 Forbidden
   c. Obtiene currentStatus del booking
   d. Valida que no esté COMPLETED o CANCELLED
   e. Valida transición según validTransitions
      if (!validTransitions[currentStatus].includes(newStatus))
         → 400 Bad Request
   f. Actualiza status en BD
   g. Devuelve booking actualizado

4. Response: 200 OK con booking.status = "CONFIRMED"
```

**Validaciones:**
- ✅ Usuario es owner del negocio o ADMIN
- ✅ Estado actual no es final
- ✅ Transición es válida

---

### FLUJO 3: Cliente modifica su reserva

```
1. Cliente → PATCH /bookings/:id
   Body: { startTime: "2024-03-20T15:00:00Z" }
   Header: Bearer token

2. Service.update(id, dto, userId)
   a. Busca booking con findOne(id)
   b. Verifica ownership:
      if (booking.userId !== userId) → 403
   c. Verifica estado:
      if (booking.status !== 'PENDING') → 400
   d. Si cambia startTime:
      - Calcula nuevo endTime
      - Valida disponibilidad (excluyendo booking actual)
      - Actualiza startTime y endTime
   e. Si solo cambia notes:
      - Actualiza notes directamente
   f. Devuelve booking actualizado

3. Response: 200 OK
```

**Regla clave:** Solo se pueden modificar reservas PENDING.

---

### FLUJO 4: Owner ve reservas de su negocio

```
1. Owner → GET /bookings/businesses/:businessId
   Query: ?status=CONFIRMED&startDate=2024-03-15
   Header: Bearer token

2. Service.findBusinessBookings(businessId, userId, userRole, filters)
   a. Busca business por ID
   b. Verifica ownership:
      if (business.ownerId !== userId && role !== 'ADMIN') → 403
   c. Obtiene todos los serviceIds del negocio:
      services = findMany({ where: { businessId } })
      serviceIds = services.map(s => s.id)
   d. Construye where dinámico:
      where = { serviceId: { in: serviceIds } }
      if (status) where.status = status
      if (dates) where.startTime = { gte, lte }
   e. Query paginada con Promise.all:
      - findMany (con skip/take)
      - count (para metadata)
   f. Devuelve PaginatedResponseDto

3. Response: 200 OK con { data: [...], meta: {...} }
```

**Ventaja:** Un negocio puede tener múltiples servicios, este endpoint trae reservas de TODOS.

---

## 📡 ENDPOINTS Y PERMISOS

| Endpoint | Método | Permisos | Función |
|----------|--------|----------|---------|
| `/bookings` | POST | Autenticado | Crear reserva |
| `/bookings` | GET | ADMIN | Listar todas |
| `/bookings/my-bookings` | GET | Autenticado | Mis reservas |
| `/bookings/businesses/:id` | GET | Owner/ADMIN | Reservas del negocio |
| `/bookings/:id` | GET | Autenticado | Ver detalle |
| `/bookings/:id` | PATCH | Owner booking | Modificar (solo PENDING) |
| `/bookings/:id/status` | PATCH | Owner negocio/ADMIN | Cambiar estado |
| `/bookings/:id` | DELETE | Cliente/Owner/ADMIN | Cancelar |

**Nota importante sobre orden:** Las rutas específicas (`my-bookings`, `:id/status`) deben estar ANTES de las rutas genéricas (`:id`) en el controller.

---

## 🧪 TESTING REALIZADO

### Suite Completa (18 Tests)

**Tests de Creación:**
1. ✅ Crear reserva válida → 201
2. ✅ Reservar en el pasado → 400
3. ✅ Conflicto de horarios → 409
4. ✅ Reserva sin conflicto → 201

**Tests de Consulta:**
5. ✅ Ver mis reservas → 200
6. ✅ Filtros y paginación → 200
7. ✅ Ver detalle → 200
14. ✅ Reservas del negocio (Owner) → 200
17. ✅ Listar todas (ADMIN) → 200
18. ✅ Listar todas (CLIENT) → 403

**Tests de Modificación:**
8. ✅ Modificar PENDING (propio) → 200
9. ✅ Modificar ajena → 403
11. ✅ Modificar CONFIRMED → 400

**Tests de Estado:**
10. ✅ Confirmar (Owner) → 200
12. ✅ Completar → 200
13. ✅ Transición inválida → 400

**Tests de Cancelación:**
15. ✅ Cancelar reserva → 200
16. ✅ Cancelar ya cancelada → 400

**Resultado: 18/18 tests exitosos (100%)**

---

## 🎊 RESULTADOS DE ESTA FASE

### Código Producido

| Componente | Archivos | Líneas | Complejidad |
|------------|----------|--------|-------------|
| Schema Prisma | 1 modelo | ~25 | Media |
| DTOs | 5 archivos | ~80 | Baja |
| Service | 1 archivo | ~469 | Alta |
| Controller | 1 archivo | ~99 | Media |
| Module | 1 archivo | ~12 | Baja |
| **TOTAL** | **8 archivos** | **~685** | **Alta** |

### Funcionalidades Implementadas

- ✅ CRUD completo de reservas
- ✅ Validación de disponibilidad (algoritmo de 3 casos)
- ✅ Máquina de estados con transiciones validadas
- ✅ Autorización multi-nivel (Cliente/Owner/Admin)
- ✅ Cálculo automático de horarios
- ✅ Paginación en todos los listados
- ✅ Filtros por estado y fechas
- ✅ Soft-delete conceptual (status CANCELLED)
- ✅ Queries optimizadas con Promise.all
- ✅ Includes para relaciones complejas

### Conceptos Nuevos Aprendidos

1. **Algoritmo de detección de conflictos** (3 casos con OR)
2. **State machine** (validación de transiciones)
3. **Manejo de DateTime** (cálculo con setMinutes)
4. **Operadores de comparación** (lte, gte, lt, gt)
5. **Query con `in`** (múltiples IDs)
6. **Método privado** en TypeScript
7. **Optional chaining** (`?.includes()`)
8. **Fix de decoradores** (extracción de propiedades)
9. **Orden crítico de rutas** (específicas antes de genéricas)
10. **Validación condicional** (solo si campo existe)

### Tiempo Invertido

- **Planificación y diseño:** 1 hora
- **Schema y DTOs:** 1.5 horas
- **BookingsService:** 4.5 horas (el más complejo)
- **BookingsController:** 1 hora
- **Fix de @CurrentUser:** 30 minutos
- **Testing completo:** 2 horas
- **Total:** ~10 horas

---

## 🚀 PRÓXIMAS FASES

### Mejoras Opcionales para Bookings

**Posibles extensiones:**
- Notificaciones por email al confirmar/cancelar
- Recordatorios automáticos (24h antes)
- Sistema de calificaciones post-servicio
- Límite de reservas simultáneas por cliente
- Horarios de atención del negocio
- Días bloqueados (vacaciones)
- Reservas recurrentes

### Fase 6: Frontend (React/Next.js)

**Páginas a crear:**
- Catálogo de negocios
- Detalle de negocio con calendario de disponibilidad
- Formulario de reserva con selección de fecha/hora
- Dashboard de cliente (mis reservas)
- Dashboard de owner (gestionar reservas)
- Notificaciones en tiempo real

### Fase 7: Swagger Documentation

**Objetivo:** Documentación interactiva
- Instalar @nestjs/swagger
- Decorar todos los endpoints
- UI en /api/docs

### Fase 8: Tests Automatizados

**Objetivo:** Garantizar calidad
- Tests unitarios con Jest
- Tests E2E con Supertest
- Coverage mínimo 70%

### Fase 9: DevOps y Deploy

**Objetivo:** Llevar a producción
- Docker Compose
- CI/CD con GitHub Actions
- Deploy en Railway/Render
- Base de datos en producción

---

## 📝 CONCLUSIONES DE FASE 5

### Lo que Funcionó Bien

1. **Metodología de enseñanza:** Explicar primero, implementar después, verificar al final
2. **División en pasos pequeños:** Cada método del service se implementó y entendió individualmente
3. **Testing exhaustivo:** 18 tests manuales garantizaron funcionalidad completa
4. **Fix rápido del decorador:** Detectar y corregir el problema con @CurrentUser fue clave
5. **Reutilización de código:** findOne() usado por múltiples métodos (DRY)

### Lecciones Aprendidas

1. **Orden de rutas es crítico:** Las rutas específicas deben estar antes de las genéricas
2. **Validación temprana:** Verificar existencia y permisos al inicio ahorra queries innecesarias
3. **State machines son poderosos:** Controlar transiciones evita estados inválidos
4. **Algoritmos complejos necesitan tiempo:** La validación de disponibilidad requirió análisis cuidadoso
5. **Testing manual es valioso:** Probar todos los casos de uso reveló el bug del decorador

### Desafíos Enfrentados

1. **Bug del decorador @CurrentUser:** Devolvía objeto completo en lugar del campo específico
2. **Lógica de conflictos de horarios:** Requirió pensar los 3 casos posibles
3. **Validación de transiciones de estado:** Implementar la state machine correctamente
4. **Orden de rutas en controller:** Entender por qué `my-bookings` debe estar antes de `:id`
5. **Queries complejas:** findBusinessBookings requiere joins múltiples

### Impacto en el Proyecto

**Sistema ahora está 85% completo:**
- ✅ Backend funcional completo (Auth, Users, Business, Services, Bookings)
- ✅ 30 endpoints REST funcionando
- ✅ Validaciones complejas implementadas
- ⏸️ Frontend pendiente (Fase 6)
- ⏸️ Deploy pendiente (Fase 7)

**Este módulo de Bookings es el más complejo e importante del sistema.** Todo lo construido en fases anteriores preparó el terreno para esta funcionalidad core.

---

## 🏆 LOGRO DESBLOQUEADO

```
╔════════════════════════════════════════════════╗
║                                                ║
║   🎉  FASE 5 COMPLETADA: BOOKINGS MODULE  🎉   ║
║                                                ║
║   ✅ Sistema de reservas funcional             ║
║   ✅ Validación de disponibilidad avanzada     ║
║   ✅ State machine implementada                ║
║   ✅ 8 endpoints REST                          ║
║   ✅ 18/18 tests exitosos                      ║
║   ✅ ~685 líneas de código                     ║
║   ✅ ~10 horas de desarrollo                   ║
║                                                ║
║   Backend: 85% completo                        ║
║   Próximo: Frontend o Swagger                  ║
║                                                ║
╚════════════════════════════════════════════════╝
```

**¡El núcleo del sistema está completo! El backend es production-ready.** 🚀

---

**Última actualización:** Febrero 2026  
**Documentado por:** Equipo de desarrollo  
**Próxima fase:** Frontend con React/Next.js o Swagger Documentation