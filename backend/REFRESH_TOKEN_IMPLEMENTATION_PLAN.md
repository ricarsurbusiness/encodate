# 🔐 PLAN DE IMPLEMENTACIÓN: REFRESH TOKEN SYSTEM

**Proyecto:** Sistema de Reservas para Negocios  
**Mejora:** Refresh Token Pattern para autenticación segura  
**Fecha de creación:** Febrero 2026  
**Tiempo estimado:** 3-4 horas  
**Prioridad:** Alta (Seguridad)

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Problema Actual](#-problema-actual)
3. [Solución Propuesta](#-solución-propuesta)
4. [Conceptos Técnicos](#-conceptos-técnicos)
5. [Arquitectura del Sistema](#-arquitectura-del-sistema)
6. [Plan de Implementación](#-plan-de-implementación)
7. [Checklist de Tareas](#-checklist-de-tareas)
8. [Testing Plan](#-testing-plan)
9. [Cambios en Frontend (Futuro)](#-cambios-en-frontend-futuro)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué vamos a construir?

Implementar el patrón de **Refresh Token** para mejorar la seguridad y experiencia de usuario del sistema de autenticación.

### Problema que resuelve

- ❌ Tokens de larga duración (24h) son un riesgo de seguridad
- ❌ No hay forma de revocar tokens comprometidos
- ❌ Usuarios deben hacer login frecuentemente
- ❌ No hay gestión de sesiones

### Solución

- ✅ Access Token corto (15 minutos)
- ✅ Refresh Token largo (7 días)
- ✅ Renovación automática sin login
- ✅ Capacidad de revocar tokens
- ✅ Gestión de sesiones en base de datos

### Beneficios

1. **Seguridad mejorada:** Token de acceso válido solo 15 minutos
2. **Mejor UX:** Usuario no necesita hacer login constantemente
3. **Control de sesiones:** Capacidad de cerrar sesiones remotamente
4. **Production-ready:** Implementa best practices de la industria
5. **Portfolio:** Feature profesional para demostrar

---

## ❌ PROBLEMA ACTUAL

### Sistema Actual de Autenticación

```
1. Usuario hace login
   ↓
2. Backend genera JWT (access_token)
   - Duración: 24 horas
   - Sin forma de revocarlo
   ↓
3. Usuario usa el token para requests
   ↓
4. Después de 24h, token expira
   ↓
5. Usuario debe hacer login nuevamente
```

### Problemas Identificados

**1. Riesgo de Seguridad**
- Si alguien roba el token, es válido por 24 horas completas
- No hay forma de invalidarlo antes de que expire
- Tokens de larga duración son vulnerable a ataques XSS/Man-in-the-middle

**2. Mala Experiencia de Usuario**
- Usuario debe recordar hacer login cada 24h
- Pérdida de trabajo si el token expira durante uso
- Interrupciones constantes en la navegación

**3. Sin Gestión de Sesiones**
- No hay registro de sesiones activas
- No se puede cerrar sesión en todos los dispositivos
- No hay forma de auditar accesos

**4. No es Production-Ready**
- Las aplicaciones profesionales usan refresh tokens
- No cumple con mejores prácticas de seguridad
- Dificulta implementación de features avanzados (ej: "Cerrar otras sesiones")

---

## ✅ SOLUCIÓN PROPUESTA

### Sistema con Refresh Token

```
1. Usuario hace login
   ↓
2. Backend genera 2 tokens:
   - Access Token: JWT (15 minutos)
   - Refresh Token: String aleatorio único (7 días)
   ↓
3. Refresh Token se guarda en BD con:
   - ID único
   - userId
   - token hash
   - expiresAt
   - isRevoked
   ↓
4. Usuario usa Access Token para requests normales
   ↓
5. Después de 15 min, Access Token expira
   ↓
6. Frontend detecta 401 Unauthorized
   ↓
7. Frontend envía Refresh Token a POST /auth/refresh
   ↓
8. Backend valida Refresh Token:
   - Verifica que existe en BD
   - No está revocado
   - No ha expirado
   - Genera nuevo Access Token
   ↓
9. Usuario continúa sin interrupciones
   ↓
10. Después de 7 días, Refresh Token expira
    ↓
11. Usuario debe hacer login nuevamente
```

### Comparación

| Aspecto | Sistema Actual | Sistema con Refresh Token |
|---------|----------------|---------------------------|
| **Duración Access Token** | 24 horas | 15 minutos |
| **Frecuencia de login** | Cada 24h | Cada 7 días |
| **Riesgo si roban token** | Alto (válido 24h) | Bajo (válido 15min) |
| **Revocación** | Imposible | Posible (marcar isRevoked) |
| **Gestión de sesiones** | No existe | Sí (tabla en BD) |
| **UX** | Interrupciones cada 24h | Transparente por 7 días |
| **Seguridad** | Baja | Alta |
| **Production-ready** | No | Sí |

---

## 🎓 CONCEPTOS TÉCNICOS

### 1. Access Token vs Refresh Token

**Access Token (JWT):**
- Duración corta (15 minutos)
- Se envía en CADA request (header Authorization)
- Contiene claims del usuario (id, email, role)
- NO se guarda en base de datos
- Stateless (no requiere lookup en BD)
- Si es robado, solo es válido 15 minutos

**Refresh Token:**
- Duración larga (7 días)
- Solo se usa para obtener nuevo Access Token
- Es un string aleatorio único (UUID o hash)
- SE GUARDA en base de datos
- Stateful (requiere verificación en BD)
- Puede ser revocado en cualquier momento

### 2. ¿Por qué 15 minutos y 7 días?

**Access Token - 15 minutos:**
- Suficiente para una sesión de trabajo continua
- Si es robado, ventana de exposición mínima
- Balance entre seguridad y performance (no muchos refreshes)

**Refresh Token - 7 días:**
- Usuario no necesita login en toda la semana
- Suficiente para uso diario normal
- No tan largo como para ser riesgoso si es comprometido

### 3. Flujo de Renovación (Refresh Flow)

```
Frontend                    Backend
   |                           |
   |  GET /bookings            |
   |  Header: Bearer (expired) |
   |-------------------------->|
   |                           |
   |  401 Unauthorized         |
   |<--------------------------|
   |                           |
   | POST /auth/refresh        |
   | Body: { refreshToken }    |
   |-------------------------->|
   |                           |
   |  Verifica token en BD     |
   |  - Existe?                |
   |  - isRevoked = false?     |
   |  - expiresAt > now?       |
   |                           |
   |  200 OK                   |
   |  { access_token }         |
   |<--------------------------|
   |                           |
   | Retry GET /bookings       |
   | Header: Bearer (new)      |
   |-------------------------->|
   |                           |
   |  200 OK + data            |
   |<--------------------------|
```

### 4. Revocación de Tokens

**¿Cuándo revocar?**
- Usuario hace logout
- Usuario cambia contraseña
- Detectas actividad sospechosa
- Usuario solicita "Cerrar todas las sesiones"

**¿Cómo funciona?**
```sql
UPDATE refresh_tokens 
SET is_revoked = true 
WHERE user_id = 'user-uuid'
```

Al intentar usar el refresh token:
```javascript
if (tokenRecord.isRevoked) {
  throw new UnauthorizedException('Token has been revoked');
}
```

### 5. Seguridad: ¿Guardar el token como hash?

**Opción A: Guardar token plano**
```javascript
token = 'abc123xyz...'
// Guardar directamente en BD
```
✅ Más simple
❌ Si hackean BD, tienen los tokens

**Opción B: Guardar token hasheado (RECOMENDADO)**
```javascript
token = 'abc123xyz...'
hashedToken = bcrypt.hashSync(token, 10)
// Guardar hash en BD
```
✅ Más seguro (hash irreversible)
✅ Si hackean BD, no pueden usar tokens
❌ Ligeramente más complejo

**Decisión:** Usar hash para máxima seguridad.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Nuevo Modelo en Prisma

```prisma
model RefreshToken {
  id          String   @id @default(uuid())
  token       String   @unique  // Hash del token
  userId      String   @map("user_id")
  expiresAt   DateTime @map("expires_at")
  isRevoked   Boolean  @default(false) @map("is_revoked")
  createdAt   DateTime @default(now()) @map("created_at")
  
  // Relación
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("refresh_tokens")
}

model User {
  // ... campos existentes ...
  refreshTokens RefreshToken[]  // Agregar esta relación
}
```

### Nuevos Endpoints

**1. POST /auth/refresh**
- Body: `{ refreshToken: string }`
- Response: `{ access_token: string }`
- Público (no requiere JWT)

**2. POST /auth/logout**
- Body: `{ refreshToken: string }`
- Response: `{ message: "Logged out successfully" }`
- Público (no requiere JWT)

**3. POST /auth/logout-all**
- Body: ninguno
- Response: `{ message: "All sessions closed" }`
- Requiere JWT (para identificar usuario)

### Modificaciones en Login

**Antes:**
```json
POST /auth/login
Response:
{
  "access_token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

**Después:**
```json
POST /auth/login
Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

### Estructura de Archivos

```
src/auth/
  ├── auth.controller.ts        (modificar: agregar refresh, logout)
  ├── auth.service.ts           (modificar: login, agregar refresh, logout)
  ├── dto/
  │   ├── refresh-token.dto.ts  (NUEVO)
  │   └── index.ts              (actualizar exports)
  └── strategies/
      └── jwt.strategy.ts       (modificar: reducir expiración a 15min)

prisma/
  └── schema.prisma             (agregar modelo RefreshToken)

src/config/
  └── env.config.ts             (agregar JWT_REFRESH_SECRET)

.env                            (agregar variables)
```

---

## 📝 PLAN DE IMPLEMENTACIÓN

### FASE 1: Schema y Configuración (30 minutos)

**Paso 1.1: Agregar modelo RefreshToken a schema.prisma**
- Crear modelo con campos: id, token, userId, expiresAt, isRevoked, createdAt
- Agregar relación en User
- Mapear nombres de columnas (@map)

**Paso 1.2: Ejecutar migración**
```bash
npx prisma migrate dev --name add-refresh-tokens
npx prisma generate
```

**Paso 1.3: Actualizar variables de entorno (.env)**
```
JWT_SECRET=tu-secreto-actual
JWT_REFRESH_SECRET=otro-secreto-diferente-y-largo
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

**Paso 1.4: Actualizar env.config.ts**
- Agregar JWT_REFRESH_SECRET
- Agregar JWT_EXPIRATION
- Agregar JWT_REFRESH_EXPIRATION

---

### FASE 2: DTOs (15 minutos)

**Paso 2.1: Crear refresh-token.dto.ts**
```typescript
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

**Paso 2.2: Actualizar index.ts de DTOs**
- Exportar RefreshTokenDto

---

### FASE 3: AuthService - Métodos Auxiliares (45 minutos)

**Paso 3.1: Método generateRefreshToken()**
- Genera UUID aleatorio
- Hashea el token con bcrypt
- Guarda en BD: { token: hash, userId, expiresAt }
- Devuelve el token SIN hashear (para enviarlo al cliente)

**Paso 3.2: Método generateTokens(user)**
- Genera access token (como antes, pero 15min)
- Genera refresh token (llamando a generateRefreshToken)
- Devuelve ambos

**Paso 3.3: Método validateRefreshToken(token)**
- Busca todos los refresh tokens del usuario (no revocados, no expirados)
- Para cada token hasheado en BD, compara con bcrypt.compare()
- Si encuentra match → devuelve el registro
- Si no → lanza UnauthorizedException

**Paso 3.4: Método revokeRefreshToken(token)**
- Encuentra el token en BD
- Marca isRevoked = true
- No lo elimina (para auditoría)

**Paso 3.5: Método revokeAllUserTokens(userId)**
- Marca todos los tokens del usuario como revocados

---

### FASE 4: AuthService - Modificar Login (30 minutos)

**Paso 4.1: Modificar método login()**
- Mantener validaciones actuales (email, password)
- En lugar de solo generar access_token
- Llamar a generateTokens(user)
- Devolver: { access_token, refresh_token, user }

**Paso 4.2: Método refresh(refreshTokenDto)**
- Extraer token del DTO
- Validar con validateRefreshToken(token)
- Si válido, obtener userId del registro
- Buscar usuario completo
- Generar SOLO nuevo access_token (no nuevo refresh)
- Devolver: { access_token }

**Paso 4.3: Método logout(refreshTokenDto)**
- Extraer token del DTO
- Llamar a revokeRefreshToken(token)
- Devolver: { message: "Logged out successfully" }

**Paso 4.4: Método logoutAll(userId)**
- Llamar a revokeAllUserTokens(userId)
- Devolver: { message: "All sessions closed" }

---

### FASE 5: AuthController - Nuevos Endpoints (20 minutos)

**Paso 5.1: Endpoint POST /auth/refresh**
```typescript
@Post('refresh')
@Public()  // No requiere JWT
async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
  return this.authService.refresh(refreshTokenDto);
}
```

**Paso 5.2: Endpoint POST /auth/logout**
```typescript
@Post('logout')
@Public()  // No requiere JWT
async logout(@Body() refreshTokenDto: RefreshTokenDto) {
  return this.authService.logout(refreshTokenDto);
}
```

**Paso 5.3: Endpoint POST /auth/logout-all**
```typescript
@Post('logout-all')
@UseGuards(JwtAuthGuard)  // Requiere JWT
async logoutAll(@CurrentUser('id') userId: string) {
  return this.authService.logoutAll(userId);
}
```

---

### FASE 6: Actualizar Configuración JWT (15 minutos)

**Paso 6.1: Modificar JwtModule.registerAsync en auth.module.ts**
- Reducir signOptions.expiresIn a '15m'
- Asegurar que usa JWT_SECRET

**Paso 6.2: Verificar jwt.strategy.ts**
- Confirmar que usa jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
- Confirmar que usa el mismo JWT_SECRET

---

### FASE 7: Testing (60 minutos)

**Test 1: Login devuelve ambos tokens**
- Hacer login
- Verificar response tiene access_token y refresh_token
- Verificar token en BD existe

**Test 2: Access token funciona (15 min)**
- Usar access_token para hacer request
- Verificar que funciona

**Test 3: Refresh token renueva access token**
- Esperar que access token expire (o simular)
- Llamar POST /auth/refresh con refresh_token
- Verificar que devuelve nuevo access_token
- Usar nuevo token para request

**Test 4: Refresh token expirado**
- Crear refresh token con expiresAt en el pasado
- Intentar refresh
- Verificar 401 Unauthorized

**Test 5: Refresh token revocado**
- Hacer login (obtener tokens)
- Hacer logout (revocar token)
- Intentar refresh
- Verificar 401 Unauthorized

**Test 6: Logout revoca el token**
- Hacer login
- Hacer logout con refresh_token
- Verificar isRevoked = true en BD
- Intentar refresh → debe fallar

**Test 7: Logout-all revoca todos los tokens**
- Hacer login desde 3 "dispositivos" (3 logins)
- Llamar POST /auth/logout-all con un access_token
- Verificar que los 3 refresh tokens están revocados
- Intentar refresh con cualquiera → debe fallar

**Test 8: Refresh token inválido**
- Enviar refresh token que no existe
- Verificar 401 Unauthorized

**Test 9: Múltiples refresh consecutivos**
- Login
- Refresh 1 → nuevo access token
- Usar access token → funciona
- Refresh 2 → otro nuevo access token
- Usar nuevo access token → funciona

---

## ✅ CHECKLIST DE TAREAS

### Schema y Base de Datos
- [ ] Agregar modelo RefreshToken a schema.prisma
- [ ] Agregar relación refreshTokens en User
- [ ] Ejecutar `npx prisma migrate dev --name add-refresh-tokens`
- [ ] Ejecutar `npx prisma generate`
- [ ] Verificar que tablas se crearon en BD

### Configuración
- [ ] Agregar JWT_REFRESH_SECRET a .env
- [ ] Agregar JWT_EXPIRATION=15m a .env
- [ ] Agregar JWT_REFRESH_EXPIRATION=7d a .env
- [ ] Actualizar env.config.ts con nuevas variables
- [ ] Modificar JwtModule para usar expiresIn: '15m'

### DTOs
- [ ] Crear src/auth/dto/refresh-token.dto.ts
- [ ] Agregar validaciones (@IsString, @IsNotEmpty)
- [ ] Exportar en src/auth/dto/index.ts

### AuthService - Métodos Auxiliares
- [ ] Implementar generateRefreshToken(userId)
- [ ] Implementar generateTokens(user)
- [ ] Implementar validateRefreshToken(token)
- [ ] Implementar revokeRefreshToken(token)
- [ ] Implementar revokeAllUserTokens(userId)

### AuthService - Métodos Principales
- [ ] Modificar login() para devolver ambos tokens
- [ ] Implementar refresh(refreshTokenDto)
- [ ] Implementar logout(refreshTokenDto)
- [ ] Implementar logoutAll(userId)

### AuthController
- [ ] Agregar endpoint POST /auth/refresh
- [ ] Agregar endpoint POST /auth/logout
- [ ] Agregar endpoint POST /auth/logout-all
- [ ] Agregar decorador @Public() donde corresponda
- [ ] Importar RefreshTokenDto

### Testing Manual
- [ ] Test 1: Login devuelve ambos tokens
- [ ] Test 2: Access token funciona
- [ ] Test 3: Refresh renueva token
- [ ] Test 4: Refresh token expirado falla
- [ ] Test 5: Refresh token revocado falla
- [ ] Test 6: Logout revoca token
- [ ] Test 7: Logout-all revoca todos
- [ ] Test 8: Token inválido falla
- [ ] Test 9: Múltiples refreshes funcionan

### Documentación
- [ ] Actualizar PHASE_1_DOCUMENTATION.md (sección de Auth)
- [ ] Crear REFRESH_TOKEN_DOCUMENTATION.md (este documento)
- [ ] Actualizar PROGRESS_AND_TODO.md
- [ ] Actualizar colección de Postman/Insomnia

### Limpieza (Opcional)
- [ ] Implementar job para eliminar tokens expirados antiguos
- [ ] Agregar índices en BD (token, userId, expiresAt)
- [ ] Considerar límite de tokens por usuario (ej: máximo 5 dispositivos)

---

## 🧪 TESTING PLAN

### Preparación para Testing

**Variables a tener:**
```
CLIENT_EMAIL=client@test.com
CLIENT_PASSWORD=Password123!
ACCESS_TOKEN=<obtenido de login>
REFRESH_TOKEN=<obtenido de login>
```

### Suite de Tests Detallada

#### TEST 1: Login devuelve ambos tokens ✅

**Request:**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "client@test.com",
  "password": "Password123!"
}
```

**Response esperada: 200 OK**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "user": {
    "id": "...",
    "email": "client@test.com",
    "name": "Cliente Test",
    "role": "CLIENT"
  }
}
```

**Verificar:**
- ✅ Response tiene access_token (JWT)
- ✅ Response tiene refresh_token (UUID)
- ✅ Response tiene user
- ✅ En BD existe registro en refresh_tokens con token hasheado

---

#### TEST 2: Access token funciona ✅

**Request:**
```http
GET http://localhost:3000/bookings/my-bookings
Authorization: Bearer <ACCESS_TOKEN>
```

**Response esperada: 200 OK** con listado de reservas

---

#### TEST 3: Refresh renueva access token ✅

**Request:**
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response esperada: 200 OK**
```json
{
  "access_token": "eyJhbGc... (nuevo token)"
}
```

**Verificar:**
- ✅ Nuevo access_token es diferente al anterior
- ✅ Nuevo access_token funciona para requests
- ✅ Refresh token sigue siendo el mismo (no se regenera)

---

#### TEST 4: Access token expirado + refresh exitoso 🔄

**Pasos:**
1. Hacer login (guardar tokens)
2. **Esperar 16 minutos** (o modificar JWT_EXPIRATION a 1m para testing)
3. Intentar usar access token

**Request que falla:**
```http
GET http://localhost:3000/bookings/my-bookings
Authorization: Bearer <ACCESS_TOKEN_EXPIRADO>
```

**Response esperada: 401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Luego, refresh:**
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response esperada: 200 OK** con nuevo access_token

---

#### TEST 5: Refresh token inválido ❌

**Request:**
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "token-inventado-123"
}
```

**Response esperada: 401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

---

#### TEST 6: Logout revoca token ✅

**Paso 1: Login**
```http
POST http://localhost:3000/auth/login
```
→ Guardar refresh_token

**Paso 2: Logout**
```http
POST http://localhost:3000/auth/logout
Content-Type: application/json

{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response esperada: 200 OK**
```json
{
  "message": "Logged out successfully"
}
```

**Paso 3: Intentar usar refresh token**
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response esperada: 401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Refresh token has been revoked",
  "error": "Unauthorized"
}
```

**Verificar en BD:**
```sql
SELECT * FROM refresh_tokens WHERE token = '<hash>';
-- isRevoked debe ser true
```

---

#### TEST 7: Logout-all cierra todas las sesiones ✅

**Paso 1: Login desde 3 "dispositivos"**
```http
POST http://localhost:3000/auth/login
(hacer 3 veces)
```
→ Guardar los 3 refresh_tokens

**Paso 2: Logout-all con un access_token**
```http
POST http://localhost:3000/auth/logout-all
Authorization: Bearer <ACCESS_TOKEN_DE_CUALQUIER_LOGIN>
```

**Response esperada: 200 OK**
```json
{
  "message": "All sessions closed"
}
```

**Paso 3: Intentar refresh con cualquiera de los 3 tokens**
```http
POST http://localhost:3000/auth/refresh
(probar con token 1, 2 y 3)
```

**Response esperada: 401 Unauthorized** en los 3 casos

**Verificar en BD:**
```sql
SELECT * FROM refresh_tokens WHERE user_id = '<user_id>';
-- Todos deben tener isRevoked = true
```

---

#### TEST 8: Refresh token expirado ❌

**Opción A: Esperar 7 días (no práctico)**

**Opción B: Modificar en BD para testing**
```sql
UPDATE refresh_tokens 
SET expires_at = NOW() - INTERVAL '1 day'
WHERE token = '<hash>';
```

**Request:**
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Response esperada: 401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Refresh token has expired",
  "error": "Unauthorized"
}
```

---

#### TEST 9: Múltiples refreshes consecutivos ✅

**Paso 1: Login**
→ Guardar tokens

**Paso 2: Refresh #1**
```http
POST http://localhost:3000/auth/refresh
```
→ Guardar nuevo access_token_1

**Paso 3: Usar access_token_1**
```http
GET http://localhost:3000/bookings/my-bookings
Authorization: Bearer <access_token_1>
```
→ Debe funcionar ✅

**Paso 4: Refresh #2 (con mismo refresh token)**
```http
POST http://localhost:3000/auth/refresh
```
→ Guardar nuevo access_token_2

**Paso 5: Usar access_token_2**
```http
GET http://localhost:3000/bookings/my-bookings
Authorization: Bearer <access_token_2>
```
→ Debe funcionar ✅

**Verificar:**
- ✅ Se puede hacer múltiples refreshes con mismo refresh_token
- ✅ Refresh token no se consume (sigue válido)
- ✅ Solo expira después de 7 días o al hacer logout

---

### Casos Edge (Opcionales pero Recomendados)

#### TEST 10: Cambio de contraseña revoca tokens

**Flujo:**
1. Login → obtener tokens
2. Cambiar contraseña (PATCH /users/change-password)
3. Intentar refresh → debe fallar (tokens revocados)

**Implementación:** En UsersService.changePassword(), llamar a authService.revokeAllUserTokens(userId)

---

#### TEST 11: Usuario eliminado

**Flujo:**
1. Login → obtener tokens
2. Eliminar usuario (DELETE /users/:id por admin)
3. Intentar refresh → debe fallar (usuario no existe)

**Implementación:** La relación onDelete: Cascade en schema ya elimina los tokens

---

#### TEST 12: Límite de tokens por usuario (Opcional)

**Flujo:**
1. Hacer 10 logins consecutivos
2. Verificar que solo existen los últimos 5 tokens en BD
3. Los más antiguos fueron eliminados automáticamente

**Implementación:** En generateRefreshToken(), verificar count de tokens activos del usuario y eliminar excedentes

---

## 📱 CAMBIOS EN FRONTEND (FUTURO)

Cuando implementes el frontend, necesitarás:

### 1. Storage de Tokens

**Guardar en localStorage/sessionStorage:**
```javascript
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);
```

**O mejor: httpOnly cookies (más seguro):**
Backend envía refresh_token como cookie:
```typescript
res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
});
```

### 2. Axios Interceptor (React/Next.js)

```javascript
// Interceptor para detectar 401 y hacer refresh automático
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        const { access_token } = response.data;
        
        localStorage.setItem('access_token', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        return axios(originalRequest); // Retry original request
      } catch (refreshError) {
        // Refresh falló, redirigir a login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 3. Login Component

```javascript
async function handleLogin(email, password) {
  const response = await axios.post('/auth/login', { email, password });
  const { access_token, refresh_token, user } = response.data;
  
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('user', JSON.stringify(user));
  
  router.push('/dashboard');
}
```

### 4. Logout Component

```javascript
async function handleLogout() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  try {
    await axios.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.clear();
    router.push('/login');
  }
}
```

### 5. Logout All Devices

```javascript
async function handleLogoutAll() {
  try {
    const accessToken = localStorage.getItem('access_token');
    await axios.post('/auth/logout-all', {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  } catch (error) {
    console.error('Logout all error:', error);
  } finally {
    localStorage.clear();
    router.push('/login');
  }
}
```

---

## 📊 MÉTRICAS ESPERADAS

### Código a Agregar

| Componente | Archivos | Líneas |
|------------|----------|--------|
| Schema Prisma | 1 modelo | ~15 |
| DTOs | 1 archivo | ~10 |
| AuthService | 5 métodos nuevos | ~150 |
| AuthController | 3 endpoints | ~25 |
| Config | Variables env | ~5 |
| **TOTAL** | **~7 archivos** | **~205 líneas** |

### Endpoints Nuevos

| Endpoint | Método | Función |
|----------|--------|---------|
| `/auth/refresh` | POST | Renovar access token |
| `/auth/logout` | POST | Cerrar sesión |
| `/auth/logout-all` | POST | Cerrar todas las sesiones |

### Testing

- **Tests manuales:** 9-12 tests
- **Tiempo de testing:** ~60 minutos
- **Coverage esperado:** 90%+ en AuthService

---

## 🎯 BENEFICIOS FINALES

### Para el Usuario
- ✅ No necesita hacer login cada 24h
- ✅ Sesiones de 7 días sin interrupciones
- ✅ Puede cerrar sesiones en otros dispositivos
- ✅ Mayor seguridad de su cuenta

### Para el Sistema
- ✅ Tokens de acceso de corta duración (15min)
- ✅ Capacidad de revocar tokens comprometidos
- ✅ Gestión de sesiones en base de datos
- ✅ Auditoría de sesiones activas
- ✅ Production-ready según best practices

### Para tu Portfolio
- ✅ Implementación profesional de autenticación
- ✅ Conocimiento de patrones de seguridad avanzados
- ✅ Feature que distingue proyectos amateur de profesionales
- ✅ Demuestra comprensión de seguridad web

---

## 🚨 ADVERTENCIAS Y CONSIDERACIONES

### Seguridad

1. **NUNCA guardar refresh token en localStorage si es app pública**
   - Vulnerable a XSS
   - Mejor: httpOnly cookies

2. **Siempre hashear refresh tokens en BD**
   - Usar bcrypt con salt rounds >= 10
   - Si hackean BD, no pueden usar tokens

3. **Implementar rate limiting en /auth/refresh**
   - Prevenir brute force
   - Máximo 5 intentos por minuto

4. **Considerar rotación de refresh tokens**
   - Cada refresh genera nuevo refresh_token
   - Invalida el anterior (one-time use)
   - Más seguro pero más complejo

### Performance

1. **Índices en Base de Datos**
```sql
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

2. **Limpieza de tokens expirados**
   - Implementar cron job para eliminar tokens > 30 días
   - Evitar crecimiento infinito de tabla

3. **Límite de tokens por usuario**
   - Máximo 5-10 dispositivos simultáneos
   - Eliminar tokens más antiguos automáticamente

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Refresh Token](https://oauth.net/2/refresh-tokens/)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

### Artículos Recomendados

- "Stop using JWT for sessions" - Blog de Supertokens
- "The Ultimate Guide to handling JWTs on frontend clients" - Blog de Hasura
- "Refresh Tokens: When to Use Them and How" - Auth0 Blog

### Conceptos para Profundizar

- Token rotation strategies
- Silent refresh (iframe technique)
- Sliding sessions
- Token binding
- PKCE (Proof Key for Code Exchange)

---

## ✅ CRITERIOS DE COMPLETITUD

La implementación está completa cuando:

- [ ] Schema tiene modelo RefreshToken
- [ ] Login devuelve access_token Y refresh_token
- [ ] POST /auth/refresh funciona correctamente
- [ ] POST /auth/logout revoca el token
- [ ] POST /auth/logout-all revoca todos los tokens
- [ ] Access token expira en 15 minutos
- [ ] Refresh token expira en 7 días
- [ ] Tokens revocados no se pueden usar
- [ ] Tokens expirados no se pueden usar
- [ ] Se pueden hacer múltiples refreshes con mismo refresh_token
- [ ] Todos los 9 tests pasan exitosamente
- [ ] Documentación actualizada

---

## 🎊 CONCLUSIÓN

La implementación de Refresh Tokens transformará el sistema de autenticación de:
- ❌ Amateur → ✅ Profesional
- ❌ Inseguro → ✅ Seguro
- ❌ Inconveniente → ✅ User-friendly

Es una inversión de **3-4 horas** que agregará un **feature crítico** que distinguirá tu proyecto como production-ready.

**¡Vamos a implementarlo! 🚀**

---

**Próximos pasos:**
1. Guardar este documento
2. Comenzar con FASE 1: Schema y Configuración
3. Seguir el plan paso a paso
4. Testear exhaustivamente
5. Documentar resultados

---

_Documento creado: Febrero 2026_  
_Última actualización: Febrero 2026_  
_Estado: Listo para implementación_
