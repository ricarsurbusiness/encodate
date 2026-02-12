# 📚 GUÍA DE SWAGGER - BOOKING SYSTEM API

**Proyecto:** Sistema de Reservas para Negocios  
**Última actualización:** Diciembre 2024  
**Estado:** Completamente documentado ✅

---

## 🎯 ACCESO A SWAGGER

### URL de Documentación

Una vez que el servidor esté corriendo:

```
http://localhost:3000/api/docs
```

**En producción:**
```
https://tu-dominio.com/api/docs
```

---

## 🚀 INICIO RÁPIDO

### 1. Iniciar el Servidor

```bash
cd backend
pnpm start:dev
```

### 2. Abrir Swagger UI

Abre tu navegador en: `http://localhost:3000/api/docs`

### 3. Explorar la Documentación

Verás 5 secciones principales:
- 🔐 **auth** - Autenticación y registro
- 👤 **users** - Gestión de usuarios
- 🏢 **businesses** - Gestión de negocios
- 🛠️ **services** - Gestión de servicios
- 📅 **bookings** - Gestión de reservas

---

## 🔐 AUTENTICACIÓN EN SWAGGER

### Paso 1: Hacer Login

1. Expande la sección **auth**
2. Click en `POST /auth/login`
3. Click en **"Try it out"**
4. Edita el JSON con tus credenciales:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

5. Click **"Execute"**
6. **Copia el `accessToken`** de la respuesta

### Paso 2: Autorizar Requests

1. Click en el botón **"Authorize" 🔓** (arriba a la derecha)
2. Pega el `accessToken` en el campo de texto
3. Click **"Authorize"**
4. Click **"Close"**

**¡Listo!** Ahora puedes probar endpoints protegidos.

---

## 📋 ENDPOINTS DISPONIBLES

### 🔐 Auth (Autenticación)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ No |
| POST | `/auth/login` | Iniciar sesión | ❌ No |
| POST | `/auth/refresh` | Renovar access token | ❌ No |
| POST | `/auth/logout` | Cerrar sesión | ❌ No |
| POST | `/auth/logout-all` | Cerrar todas las sesiones | ✅ Sí |
| GET | `/auth/profile` | Obtener perfil (Admin) | ✅ Sí (ADMIN) |

### 👤 Users (Usuarios)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Mi perfil | ✅ Sí |
| PATCH | `/users/me` | Actualizar mi perfil | ✅ Sí |
| PUT | `/users/me/password` | Cambiar mi contraseña | ✅ Sí |
| GET | `/users` | Listar usuarios | ✅ Sí (ADMIN) |
| GET | `/users/:id` | Obtener usuario por ID | ✅ Sí (ADMIN) |
| PATCH | `/users/:id/role` | Actualizar rol | ✅ Sí (ADMIN) |
| DELETE | `/users/:id` | Eliminar usuario | ✅ Sí (ADMIN) |

### 🏢 Businesses (Negocios)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/businesses` | Crear negocio | ✅ Sí (ADMIN/STAFF) |
| GET | `/businesses` | Listar negocios | ❌ No |
| GET | `/businesses/my-businesses` | Mis negocios | ✅ Sí |
| GET | `/businesses/:id` | Obtener negocio por ID | ❌ No |
| PATCH | `/businesses/:id` | Actualizar negocio | ✅ Sí (Owner/ADMIN) |
| DELETE | `/businesses/:id` | Eliminar negocio | ✅ Sí (Owner/ADMIN) |

### 🛠️ Services (Servicios)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/businesses/:businessId/services` | Crear servicio | ✅ Sí (ADMIN/STAFF) |
| GET | `/businesses/:businessId/services` | Listar servicios | ❌ No |
| GET | `/services/:id` | Obtener servicio por ID | ❌ No |
| PATCH | `/services/:id` | Actualizar servicio | ✅ Sí (Owner/ADMIN) |
| DELETE | `/services/:id` | Eliminar servicio | ✅ Sí (Owner/ADMIN) |

### 📅 Bookings (Reservas)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Crear reserva | ✅ Sí |
| GET | `/bookings` | Listar todas (Admin) | ✅ Sí (ADMIN) |
| GET | `/bookings/my-bookings` | Mis reservas | ✅ Sí |
| GET | `/bookings/businesses/:id` | Reservas de negocio | ✅ Sí (Owner/ADMIN) |
| GET | `/bookings/:id` | Obtener reserva por ID | ✅ Sí |
| PATCH | `/bookings/:id` | Actualizar reserva | ✅ Sí |
| PATCH | `/bookings/:id/status` | Cambiar estado | ✅ Sí |
| DELETE | `/bookings/:id` | Cancelar reserva | ✅ Sí |

---

## 🧪 EJEMPLOS DE USO

### Ejemplo 1: Registro de Usuario

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Respuesta Exitosa (201):**
```json
{
  "user": {
    "id": "f272e392-20f6-439b-b8f5-ca5c4m0e045e",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "CLIENT"
  }
}
```

---

### Ejemplo 2: Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Respuesta Exitosa (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "f272e392-20f6-439b-b8f5-ca5c4m0e045e",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "CLIENT"
  }
}
```

---

### Ejemplo 3: Crear Negocio

**Endpoint:** `POST /businesses`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "Spa Relax",
  "description": "Spa de relajación y bienestar",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "categoryIds": ["category-uuid-1", "category-uuid-2"]
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "business-uuid",
  "name": "Spa Relax",
  "description": "Spa de relajación y bienestar",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "ownerId": "owner-uuid",
  "createdAt": "2024-12-15T10:00:00.000Z",
  "categories": [...]
}
```

---

### Ejemplo 4: Crear Reserva

**Endpoint:** `POST /bookings`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "serviceId": "service-uuid",
  "startTime": "2024-12-20T14:00:00.000Z",
  "notes": "Prefiero masajista mujer"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "booking-uuid",
  "serviceId": "service-uuid",
  "userId": "user-uuid",
  "startTime": "2024-12-20T14:00:00.000Z",
  "endTime": "2024-12-20T15:00:00.000Z",
  "status": "PENDING",
  "notes": "Prefiero masajista mujer",
  "service": {...},
  "user": {...}
}
```

---

## 🎯 CARACTERÍSTICAS DE SWAGGER

### 1. Schemas (Modelos)

Al final de la página, en la sección **"Schemas"**, puedes ver:
- Todos los DTOs documentados
- Estructura de los objetos
- Tipos de datos
- Validaciones
- Ejemplos

### 2. Try it out

Cada endpoint tiene un botón **"Try it out"** que permite:
- Editar los parámetros
- Modificar el body
- Ejecutar la request real
- Ver la respuesta

### 3. Responses

Cada endpoint muestra:
- ✅ Respuestas exitosas (200, 201)
- ❌ Errores posibles (400, 401, 403, 404, 429)
- 📋 Estructura de cada respuesta

### 4. Security

Endpoints protegidos muestran un candado 🔒 indicando que requieren autenticación.

---

## 🔧 CARACTERÍSTICAS ESPECIALES

### Token Rotation

El endpoint `/auth/refresh` implementa **Token Rotation**:

**Comportamiento:**
1. Envías el `refreshToken` actual
2. Recibes un **nuevo** `accessToken` Y un **nuevo** `refreshToken`
3. El `refreshToken` anterior se **revoca** automáticamente

**Importante:** Siempre usa el refresh token más reciente.

---

### Rate Limiting

Algunos endpoints tienen límites de requests:

| Endpoint | Límite | Mensaje |
|----------|--------|---------|
| `/auth/login` | 6 req/min | Too Many Requests (429) |
| `/auth/refresh` | 10 req/min | Too Many Requests (429) |
| `/bookings` (POST) | 6 req/min | Too Many Requests (429) |

Si recibes **429**, espera 60 segundos.

---

### Reuse Detection

Si intentas usar un refresh token **ya revocado**:

**Respuesta:**
```json
{
  "statusCode": 401,
  "message": "Token reuse detected. All sessions have been revoked for security."
}
```

**Acción:** Haz login de nuevo.

---

## 🐛 TROUBLESHOOTING

### Error 401: Unauthorized

**Causa:** No estás autenticado o el token expiró.

**Solución:**
1. Haz login de nuevo
2. Copia el nuevo `accessToken`
3. Click en "Authorize" y pega el token

---

### Error 403: Forbidden

**Causa:** No tienes permisos para ese endpoint.

**Ejemplo:** Intentas acceder a un endpoint ADMIN con rol CLIENT.

**Solución:** Usa una cuenta con los permisos necesarios.

---

### Error 429: Too Many Requests

**Causa:** Excediste el rate limit.

**Solución:** Espera 60 segundos antes de reintentar.

---

### Swagger no carga

**Causa:** El servidor no está corriendo o hay error en la configuración.

**Solución:**
```bash
# Reiniciar el servidor
pnpm start:dev

# Verificar que no haya errores en la consola
```

---

## 📊 VENTAJAS DE USAR SWAGGER

### Para Desarrolladores

✅ **Testing rápido** - Prueba endpoints sin Postman  
✅ **Documentación siempre actualizada** - Se genera del código  
✅ **Ejemplos claros** - Request/Response de cada endpoint  
✅ **Autocomplete** - Los DTOs muestran campos requeridos  

### Para el Equipo

✅ **Frontend sabe qué esperar** - Schemas documentados  
✅ **Onboarding rápido** - Nuevos devs entienden la API rápido  
✅ **Menos preguntas** - Todo está documentado  
✅ **Profesional** - Como APIs de Stripe, Google, etc.  

### Para el Portfolio

✅ **Demuestra buenas prácticas** - Documentación es clave  
✅ **Fácil de demostrar** - Solo envías un link  
✅ **Impresiona en entrevistas** - Nivel profesional  

---

## 🎓 CONCEPTOS CLAVE

### OpenAPI 3.0

Swagger usa el estándar **OpenAPI 3.0** para describir APIs REST.

**Beneficios:**
- Estándar de la industria
- Compatible con muchas herramientas
- Generación de código automática

### Decoradores de NestJS

Swagger se configura con decoradores:

```typescript
@ApiTags('auth')              // Agrupa endpoints
@ApiOperation({...})          // Describe el endpoint
@ApiResponse({...})           // Documenta respuestas
@ApiBearerAuth('JWT-auth')    // Marca como protegido
```

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial

- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

### Herramientas Relacionadas

- **Swagger Codegen** - Genera clientes automáticamente
- **Postman** - Importa documentación OpenAPI
- **Redoc** - Alternativa a Swagger UI

---

## ✅ CHECKLIST DE USO

- [ ] Servidor corriendo en `localhost:3000`
- [ ] Swagger UI accesible en `/api/docs`
- [ ] Hice login y copié el `accessToken`
- [ ] Click en "Authorize" y pegué el token
- [ ] Probé un endpoint público (ej: `GET /businesses`)
- [ ] Probé un endpoint protegido (ej: `GET /users/me`)
- [ ] Verifiqué los schemas al final de la página
- [ ] Entiendo cómo funciona Token Rotation
- [ ] Sé qué hacer si recibo 401, 403 o 429

---

## 🎊 CONCLUSIÓN

**Swagger UI está completamente configurado** para tu Booking System API.

### Lo que tienes:

- ✅ 33 endpoints documentados
- ✅ 5 tags organizados (auth, users, businesses, services, bookings)
- ✅ Ejemplos en cada DTO
- ✅ Autenticación con Bearer JWT
- ✅ Respuestas documentadas
- ✅ Testing interactivo

### Próximo paso:

**Compartir con el equipo:**
1. Envía el link: `http://localhost:3000/api/docs`
2. Explica cómo autenticarse
3. Deja que exploren la API

---

**¡Documentación profesional lista!** 🚀

---

_Última actualización: Diciembre 2024_  
_Versión: 1.0.0_  
_Estado: Production-Ready ✅_