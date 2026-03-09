# PRD – Sistema de Reservas (Booking System) Fullstack

Versión: 1.0  
Proyecto: booking-system  
Alcance: Backend (NestJS + Prisma) ya completado, Frontend (Next.js App Router) parcialmente implementado. Este PRD define lo que falta para llevar el sistema a un estado “production-ready” a nivel funcional.

---

## 1. Visión General del Producto

El sistema de reservas permite que clientes finales encuentren negocios (p. ej. barberías, centros de estética, etc.), consulten sus servicios y disponibilidad, y creen/modifiquen/cancelen reservas.  
Los dueños de negocio (owners) gestionan sus negocios, servicios y las reservas asociadas.  
Los administradores (admins) tienen control global sobre usuarios y configuración.

Este PRD consolida:

- Lo ya disponible a nivel backend.
- El estado actual del frontend.
- Las funcionalidades que faltan para completar el flujo de reservas end-to-end.
- Requisitos funcionales y no funcionales.
- Roadmap de tareas concretas.

---

## 2. Roles de Usuario y Casos de Uso

### 2.1 Roles

1. **Cliente (USER)**
   - Se registra e inicia sesión.
   - Explora negocios y servicios.
   - Crea, consulta, modifica y cancela sus reservas.

2. **Dueño de Negocio (OWNER)**
   - Se registra/inicia sesión.
   - Crea y gestiona negocios.
   - Define servicios y disponibilidad.
   - Gestiona reservas de sus negocios (confirmar, rechazar, marcar completadas).

3. **Administrador (ADMIN)**
   - Se registra, pero el rol se asigna por otro mecanismo (semilla o endpoint restringido).
   - Gestiona usuarios (lista, cambia rol, bloquea/desbloquea).
   - Visión global (a desarrollar más adelante si se desea).

---

## 3. Backend – Resumen de Capacidades Existentes

A partir de la documentación interna (`BACKEND_SUMMARY.md`, `PHASE_*_DOCUMENTATION.md`, `PROGRESS_AND_TODO.md`), se considera:

### 3.1 Módulos Implementados

1. **Auth**
   - Registro e inicio de sesión con JWT.
   - Refresh tokens seguros (con rotación, invalidación, mitigaciones de seguridad).
   - Guardas de autenticación y roles.
   - Decorador `@CurrentUser`.

2. **Users**
   - CRUD básico de usuario (al menos update propio).
   - Listado paginado para admin.
   - Cambio de contraseña.
   - Cambio de rol (admin).

3. **Businesses**
   - CRUD de negocios.
   - Búsqueda por nombre con paginación (`SearchBusinessDto`).
   - Propiedad del negocio asociada al usuario owner.
   - Validaciones de ownership.

4. **Services**
   - CRUD de servicios dentro de un negocio.
   - Filtro y paginación por precio y duración (`FilterServiceDto`).
   - Relación con negocio.

5. **Bookings**
   - Sistema de reservas:
     - DTOs de creación, actualización, filtros.
     - Validación de disponibilidad (algoritmo de conflictos).
     - Cálculo automático de hora de finalización (`endTime`) en base a duración del servicio.
     - State machine de estados: PENDING, CONFIRMED, CANCELLED, COMPLETED (según docs).
     - Ownership multi-nivel y permisos por rol:
       - Cliente solo puede gestionar sus reservas.
       - Owner solo puede gestionar las reservas de sus negocios.
   - Endpoints (según documentación):
     - `POST /bookings`
     - `GET /bookings/my`
     - `GET /businesses/:businessId/bookings`
     - `GET /bookings/:id`
     - `PATCH /bookings/:id/status`
     - `PATCH /bookings/:id`
     - `DELETE /bookings/:id`
     - Filtros y paginación donde aplique.

6. **Infra & Cross-cutting**
   - Prisma + migraciones.
   - Configuración de entorno.
   - Pipes globales de validación con transform.
   - Paginación genérica (`PaginationDto`, `PaginationMetaDto`, `PaginatedResponseDto`).
   - Swagger ya configurado (según docs).

### 3.2 Conclusión de Backend

El backend se considera funcionalmente **completo** para un primer MVP robusto del sistema de reservas.  
Las tareas pendientes principales son de integración, UX, y algunas mejoras opcionales (tests adicionales, métricas, notificaciones/email/pagos).

---

## 4. Frontend – Estado Actual

Tecnologías:

- **Next.js (App Router)**.
- **TypeScript**.
- Hooks personalizados (`use-auth`).
- Contexto de autenticación (`AuthContext`).
- Axios configurado + React Query (`query-client.ts`) para data fetching (por el naming).
- Estructura de páginas:
  - `(auth)` – login, register.
  - `(dashboard)` – layout de dashboard + página de negocios.
  - `businesses/*` – listado, detalle, creación, edición de negocio.
  - `my-bookings/*` – componentes de UI para reservas del usuario.
  - Página de inicio de marketing (`app/page.tsx`) con secciones `Hero`, `CTA`, etc.
  - Navbar, Footer, componentes de lista y tarjeta de negocio, paginación, etc.

Observación:  
El frontend ya cubre principalmente **auth** y **businesses**, y tiene piezas para **my bookings**, pero falta integrar completamente el módulo de reservas (bookings) con el backend y cerrar flujos completos (crear reserva, editar, cancelar, owner confirmando, etc).

---

## 5. Funcionalidades Frontend Pendientes por Dominio

### 5.1 Autenticación y Gestión de Sesión

**Estado actual (parcial)**

- Páginas:
  - `/(auth)/login`
  - `/(auth)/register`
- `AuthContext` + `use-auth` + `lib/axios` para manejar token en headers.
- Falta validar por completo la integración con el sistema de refresh tokens del backend.

**Requisitos**

1. **Registro**
   - Formulario con:
     - Nombre
     - Email
     - Password
     - Confirmación de password
     - (Opcional) Selección de rol inicial: `USER` / `OWNER` (según reglas del backend; si no se permite, siempre `USER`).
   - Validación client-side básica:
     - Email válido.
     - Contraseña mínima (p. ej. 8 caracteres).
     - Igualdad entre contraseña y confirmación.
   - Llamada a `POST /auth/register`.
   - Manejo de errores del backend (email ya registrado, etc.).
   - Auto-login tras registrar o redirección a login.

2. **Login**
   - Formulario email/password.
   - Llamada a `POST /auth/login`.
   - Almacenar:
     - `accessToken` (en memoria/contexto y/o localStorage).
     - `refreshToken` (idealmente cookie HTTPOnly, pero puede haber un aproach inicial con localStorage y endpoint).
   - Manejo de errores (credenciales inválidas).
   - Redirección según rol:
     - `USER`: home o `/my-bookings`.
     - `OWNER`: dashboard `/dashboard`.
     - `ADMIN`: `/dashboard` admin (futuro).

3. **Gestión de sesión y refresh tokens**
   - Interceptor de Axios:
     - Adjuntar `Authorization: Bearer <accessToken>` en cada request autenticado.
     - Cuando el backend responde 401 por token expirado:
       - Intentar `POST /auth/refresh` con el refresh token.
       - Si éxito: reintentar la petición original.
       - Si falla: cerrar sesión (clear context / storage) y redirigir a login.
   - `AuthContext` debe:
     - Exponer `user` (payload del JWT o datos obtenidos de `/auth/profile` según diseño).
     - Exponer funciones: `login`, `logout`, `register`, `refresh`.
     - Persistir sesión entre recargas (localStorage o cookies).

4. **Protección de rutas**
   - Layouts protegidos:
     - `(dashboard)` solo accesible si `user` autenticado.
     - `my-bookings` solo para `USER` / clientes.
     - Rutas de owner solo para `OWNER`.
     - Rutas de admin solo para `ADMIN` (futuro).
   - Componente `ProtectedRoute` o lógica en layouts de app router:
     - Si no autenticado: redireccionar a `/login`.

**Tareas concretas**

- Conectar formularios de login/register con endpoints reales.
- Implementar almacenamiento de tokens y profile.
- Implementar interceptor Axios con flujo de refresh.
- Añadir protección de rutas por rol: `USER`, `OWNER`, `ADMIN`.

---

### 5.2 Gestión de Negocios (Owners & Clientes)

**Estado actual**

- Páginas:
  - `/businesses` – listado de negocios.
  - `/businesses/create` – creación.
  - `/businesses/[id]` – detalle.
  - `/businesses/[id]/edit` – edición.
- Componentes:
  - `BusinessCard`, `BusinessListt` (corregir naming), `Pagination`, etc.
- Dashboard:
  - `/dashboard/businesses` – listado dentro del dashboard (probablemente para owners).

**Requisitos**

1. **Listado público de negocios**
   - Página `/businesses` accesible a usuarios anónimos y autenticados.
   - Usa endpoint `GET /businesses` con:
     - Paginación (`page`, `limit`).
     - Búsqueda (`search`).
   - UI:
     - Barra de búsqueda por nombre.
     - Paginación.
     - Card con información básica (nombre, categoría, ubicación, rating placeholder, etc.).

2. **Detalle de negocio**
   - `/businesses/[id]`:
     - Datos del negocio (`GET /businesses/:id`).
     - Listado de servicios (`GET /businesses/:id/services` con filtros y paginación).
     - Botón “Reservar” en cada servicio → abre flujo de creación de reserva.
   - Validar:
     - Sólo mostrar botones de edición/gestión al owner del negocio.

3. **Creación y edición de negocios (OWNER)**
   - Formularios en:
     - `/businesses/create`
     - `/businesses/[id]/edit`
   - Integraciones:
     - `POST /businesses` para crear.
     - `PATCH /businesses/:id` para actualizar.
     - Opcionalmente `DELETE /businesses/:id` (soft delete / isActive).
   - Validaciones:
     - Nombre obligatorio.
     - Horarios (si el backend lo soporta).
   - Solo accesible con rol `OWNER`.

4. **Vista de negocios del owner**
   - `/dashboard/businesses`:
     - Lista de negocios donde `ownerId = currentUser.id`.
     - Acciones rápidas:
       - Editar negocio.
       - Ver servicios de negocio.
       - Ver reservas de negocio.

**Tareas concretas**

- Confirmar tipos de datos de negocio esperados según Swagger.
- Conectar todas las páginas de negocio a los endpoints reales.
- Añadir búsqueda y paginación usando React Query + query params.
- Añadir controles de permiso en UI (no mostrar acciones que backend no permite).

---

### 5.3 Gestión de Servicios (Owners)

**Estado actual**

- El backend soporta CRUD de servicios por negocio, con filtros.
- El frontend aún no presenta claramente la UI de gestión completa de servicios (habría que revisar los componentes en `services`, pero por la lista no se ve carpeta específica).

**Requisitos**

1. **Listado de servicios de un negocio (vista owner)**
   - Dentro de `/dashboard/businesses/[id]` (o similar), se mostrará:
     - `GET /businesses/:businessId/services?page=&limit=&minPrice=&maxPrice=&maxDuration`.
   - Acciones:
     - Crear nuevo servicio.
     - Editar servicio existente.
     - Eliminar / desactivar servicio.

2. **Formulario de creación/edición de servicio**
   - Campos:
     - Nombre.
     - Descripción.
     - Precio.
     - Duración (minutos).
     - (Opc) `isActive`.
   - Endpoints:
     - `POST /businesses/:businessId/services`
     - `PATCH /services/:id`
     - `DELETE /services/:id` o `PATCH` para desactivar.

3. **Filtros para clientes en la vista pública**
   - En `/businesses/[id]` (vista pública):
     - Controles de filtro por:
       - Precio mínimo/máximo.
       - Duración máxima.
     - Sin lógicas avanzadas de filtrado en frontend; solo paramétrico.

**Tareas concretas**

- Crear vistas de CRUD de servicios para owners en el dashboard.
- Integrar filtros en la vista pública de servicios por negocio.
- Reutilizar componente de paginación existente.

---

### 5.4 Módulo de Reservas (Bookings) – Cliente

**Estado actual**

- En frontend existe carpeta `app/my-bookings` con:
  - `BookingCard.tsx`
  - `BookingList.tsx`
  - `BookingStatusBadge.tsx` (y otra versión con nombre casi igual).
  - `CancelBooking.tsx`
  - `UpdateBooking.tsx`
  - `UpdateBookingModal.tsx`
  - `page.tsx`
- Esto sugiere un UI avanzado ya diseñado, pero es necesario revisar la integración real con endpoints del backend.

**Requisitos – flujo cliente**

1. **Crear reserva**
   - Desde la página de detalle de negocio, al seleccionar un servicio:
     - Mostrar un formulario/modal:
       - Fecha.
       - Hora de inicio.
       - (Opcional) notas/comentarios.
     - Validar datos de entrada.
     - Enviar `POST /bookings` con:
       - `businessId`
       - `serviceId`
       - `startTime` (ISO).
       - Cualquier campo necesario según `CreateBookingDto`.
     - Manejo de errores:
       - Conflictos de horario (backend debe devolver mensaje claro).
       - Servicio o negocio inactivo.
     - En caso de éxito:
       - Mostrar mensaje “Reserva creada con éxito”.
       - Redirigir a `/my-bookings` o mostrar resumen in-situ.

2. **Ver mis reservas**
   - Página `/my-bookings`:
     - Usa `GET /bookings/my` con paginación y filtros (si existen).
     - Muestra:
       - Información de negocio y servicio.
       - Fecha/hora.
       - Estado (badge de color).
     - Acciones por estado:
       - `PENDING`: permitir editar o cancelar.
       - `CONFIRMED`: permitir cancelar (si la lógica de negocio lo permite).
       - `CANCELLED/COMPLETED`: solo lectura.

3. **Actualizar reserva**
   - Desde `UpdateBookingModal`:
     - Permitir cambiar fecha/hora y tal vez servicio (según lo que soporte `UpdateBookingDto`).
     - Llamar a `PATCH /bookings/:id`.
     - Manejar errores de disponibilidad igual que en “crear reserva”.

4. **Cancelar reserva**
   - Botón `Cancelar`:
     - Confirmación vía modal.
     - Llamar a `DELETE /bookings/:id` o `PATCH /bookings/:id/status` → `CANCELLED`, según esté implementado en backend.
   - Tras éxito:
     - Actualizar lista local.
     - Mostrar toast / mensaje.

5. **Detalle de reserva (opcional)**
   - Página `/my-bookings/[id]` o modal:
     - Llamar a `GET /bookings/:id`.
     - Mostrar detalles completos, logs de estado (si existen), etc.

**Tareas concretas**

- Revisar y ajustar integración de:
  - `BookingList` → `GET /bookings/my`.
  - `UpdateBooking` / `UpdateBookingModal` → `PATCH /bookings/:id`.
  - `CancelBooking` → `DELETE /bookings/:id` o `PATCH .../status`.
- Completar el flujo de creación de reserva en la UI de negocio/servicio.
- Mapear los estados del backend a los badges de status en UI.
- Añadir paginación y filtros según soporte del backend.

---

### 5.5 Módulo de Reservas (Bookings) – Owner

**Requisitos – flujo owner**

1. **Ver reservas de mis negocios**
   - Nueva sección en el dashboard:
     - `/dashboard/bookings` o `/dashboard/businesses/[id]/bookings`.
   - Endpoints:
     - `GET /businesses/:businessId/bookings` (con filtros por fecha/estado, si están implementados).
   - UI:
     - Tabla o cards con:
       - Cliente.
       - Servicio.
       - Fecha/hora.
       - Estado.
     - Filtros:
       - Fecha (día, rango).
       - Estado (PENDING, CONFIRMED, etc.).

2. **Cambiar estado de reserva**
   - Acciones por fila / card:
     - `PENDING` → `CONFIRMED` o `REJECTED`/`CANCELLED`.
     - `CONFIRMED` → `COMPLETED` (después de la prestación).
   - Endpoint:
     - `PATCH /bookings/:id/status` con payload tipo `{ status: 'CONFIRMED' }`.
   - Validar que owner solo vea y modifique reservas de sus negocios.

3. **Ver detalles de la reserva**
   - Modal o página para más info:
     - Datos de contacto del cliente.
     - Notas.
     - Historial de cambios de estado (si backend lo guarda o se puede derivar).

**Tareas concretas**

- Añadir páginas de UI de owner para ver y gestionar reservas.
- Conectar acciones de estado con endpoint de cambio de estado.
- Añadir filtros y paginación.

---

### 5.6 Administración (Admin)

**Estado**

- Backend soporta:
  - `GET /users` con paginación.
  - `PATCH /users/:id/role` etc. (según DTOs `update-role`, `update-user`, `change-password`).
- Frontend todavía no refleja claramente un panel de admin.

**Requisitos (MVP admin básico)**

1. **Listado de usuarios**
   - Ruta: `/dashboard/admin/users` (solo ADMIN).
   - Endpoint: `GET /users?page=&limit=`.
   - Tabla con:
     - Nombre.
     - Email.
     - Rol.
     - Estado (activo/bloqueado si existe).

2. **Cambio de rol**
   - UI:
     - Dropdown con roles: `USER`, `OWNER`, `ADMIN`.
     - Botón “Guardar”.
   - Endpoint: `PATCH /users/:id/role`.

3. **Bloqueo/desbloqueo de usuario (opcional)**
   - Depende del soporte backend (campo `isActive` en `users`).
   - Botón para cambiar estado.

**Tareas concretas**

- Crear layout de admin dentro de dashboard.
- Conectar vistas con endpoints de users.
- Añadir controles de permiso (solo ADMIN).

---

## 6. Requisitos No Funcionales

1. **Seguridad**
   - Uso de HTTPS en producción.
   - JWT en Authorization header.
   - Refresh tokens con rotación y revocación (ya diseñado en backend).
   - Protección básica contra XSS/CSRF (aprovechar medidas por defecto de Next, cookies seguras si se usan).

2. **Performance**
   - Paginación obligatoria en listados grandes (ya implementada en backend).
   - Uso de React Query para caching y revalidación de datos.
   - Lazy loading/suspense para vistas que consulten mucha información.

3. **UX/UI**
   - Feedback visual (loading spinners, skeletons).
   - Mensajes de error útiles desde la API.
   - Confirmaciones claras para acciones destructivas (cancelar reserva, borrar negocio/servicio).

4. **Mantenibilidad**
   - Separación de lógica API en `lib/` o `services/`.
   - Tipos TypeScript compartidos en `types/` para mapear DTOs del backend.
   - Reutilización de componentes UI (cards, modals, formularios, paginación).

---

## 7. Roadmap y Tareas Concretas

### 7.1 Fase A – Integración Auth y Protección de Rutas

1. Conectar `login` y `register` con API.
2. Implementar gestión de tokens (access + refresh).
3. Añadir interceptor para refresh y reintentos.
4. Proteger rutas de:
   - `/(dashboard)` → USER/OWNER/ADMIN autenticados.
   - `/my-bookings` → USER.
   - `/dashboard/businesses` → OWNER.
   - `/dashboard/admin/*` → ADMIN.

### 7.2 Fase B – Negocios & Servicios

1. Conectar `/businesses` con:
   - `GET /businesses` + búsqueda + paginación.
2. Conectar `/businesses/[id]` con:
   - `GET /businesses/:id`
   - `GET /businesses/:id/services` + filtros.
   - Preparar botón “Reservar”.
3. Implementar formularios de:
   - `/businesses/create` → `POST /businesses`.
   - `/businesses/[id]/edit` → `PATCH /businesses/:id`.
4. Crear vistas de gestión de servicios (CRUD) para owners en dashboard.

### 7.3 Fase C – Bookings Cliente

1. Completar integración de `my-bookings`:
   - `GET /bookings/my`.
   - Paginación y filtro básico por estado (si existe).
2. Conectar `CancelBooking`:
   - `DELETE /bookings/:id` o `PATCH /bookings/:id/status` → `CANCELLED`.
3. Conectar `UpdateBooking`:
   - `PATCH /bookings/:id`.
4. Implementar flujo de creación de reserva:
   - Desde `/businesses/[id]` al seleccionar un servicio → form → `POST /bookings`.

### 7.4 Fase D – Bookings Owner

1. Crear sección `Dashboard → Reservas`:
   - Listado de reservas por negocio (`GET /businesses/:businessId/bookings`).
2. Añadir acciones de cambio de estado:
   - `PATCH /bookings/:id/status`.
3. Añadir filtros: fecha, estado.

### 7.5 Fase E – Admin

1. Crear ruta `/dashboard/admin/users`.
2. Integrar `GET /users`.
3. Integrar cambio de rol `PATCH /users/:id/role`.
4. (Opcional) Soporte de bloqueo/desbloqueo.

### 7.6 Fase F – Pulido y QA

1. Unificar estilos y componentes (botones, inputs, modals).
2. Manejo uniforme de errores con toasts/snackbars.
3. Pruebas manuales End-to-End:
   - Flujo cliente: registro → login → reservar → modificar → cancelar.
   - Flujo owner: login → crear negocio → crear servicios → recibir reserva → confirmar → completar.
   - Flujo admin: login → ver usuarios → cambiar rol.

---

## 8. Criterios de “Listo para Producción” (MVP)

Para considerar el sistema de reservas fullstack como listo para un MVP:

1. **Flujos obligatorios funcionales**
   - Cliente:
     - Registro/Login.
     - Navegar y buscar negocios.
     - Ver servicios de un negocio con filtros.
     - Crear, ver, modificar, cancelar reservas.
   - Owner:
     - Crear/editar negocio.
     - Crear/editar servicios.
     - Ver y gestionar reservas (confirmar/completar/cancelar).
   - Admin:
     - Ver usuarios.
     - Cambiar roles al menos.

2. **Seguridad básica operativa**
   - Todas las rutas sensibles protegidas con auth.
   - Control de roles funcionando.
   - Refresh token funcionando y probado.

3. **Estabilidad**
   - Sin errores no controlados en UI ante fallos comunes (401, 403, 404, 409, 500).
   - Paginación en todos los listados grandes.

4. **Documentación**
   - README del frontend actualizado con:
     - Cómo ejecutar.
     - Variables de entorno necesarias (API base URL, etc.).
   - Enlace a Swagger del backend para referencia de endpoints.

---

## 9. Resumen

- El **backend** ya provee un sistema robusto de reservas con autenticación, roles, negocios, servicios y bookings.
- El **frontend** tiene:
  - Estructura inicial de páginas.
  - Componentes de UI diseñados para negocios y bookings.
  - Infra de auth y data fetching, pero aún sin integración completa.
- Este PRD define qué falta para:
  - Integrar totalmente bookings (cliente + owner).
  - Completar gestión de negocios/servicios.
  - Implementar panel básico de admin.
  - Asegurar seguridad y experiencia de usuario razonables.

Una vez completadas las fases A–F descritas, el sistema de reservas se podrá considerar funcionalmente completo para un lanzamiento MVP en entorno real.