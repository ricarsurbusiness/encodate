# 🏗️ Backend Project Structure

This document describes the complete structure of the NestJS backend application.

## 📂 Directory Structure

```
backend/
├── src/
│   ├── main.ts                          # 🚀 Application entry point
│   ├── app.module.ts                    # 📦 Root module
│   │
│   ├── auth/                            # 🔐 Authentication Module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts           # Login, Register endpoints
│   │   ├── auth.service.ts              # Auth business logic
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── entities/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts        # JWT authentication guard
│   │   └── strategies/
│   │       └── jwt.strategy.ts          # JWT strategy
│   │
│   ├── users/                           # 👤 Users Module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts          # User CRUD endpoints
│   │   ├── users.service.ts             # User business logic
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts           # User type definitions
│   │
│   ├── businesses/                      # 🏢 Businesses Module
│   │   ├── businesses.module.ts
│   │   ├── businesses.controller.ts     # Business CRUD endpoints
│   │   ├── businesses.service.ts        # Business logic
│   │   ├── dto/
│   │   │   ├── create-business.dto.ts
│   │   │   └── update-business.dto.ts
│   │   └── entities/
│   │       └── business.entity.ts
│   │
│   ├── services/                        # 💼 Services Module (Business Services)
│   │   ├── services.module.ts
│   │   ├── services.controller.ts       # Service CRUD endpoints
│   │   ├── services.service.ts          # Services logic
│   │   ├── dto/
│   │   │   ├── create-service.dto.ts
│   │   │   └── update-service.dto.ts
│   │   └── entities/
│   │       └── service.entity.ts
│   │
│   ├── bookings/                        # 📅 Bookings Module
│   │   ├── bookings.module.ts
│   │   ├── bookings.controller.ts       # Booking endpoints
│   │   ├── bookings.service.ts          # Booking logic & availability
│   │   ├── dto/
│   │   │   ├── create-booking.dto.ts
│   │   │   ├── update-booking.dto.ts
│   │   │   └── cancel-booking.dto.ts
│   │   └── entities/
│   │       └── booking.entity.ts
│   │
│   ├── common/                          # 🛠️ Shared Resources
│   │   ├── decorators/                  # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/                      # Guards
│   │   │   └── roles.guard.ts
│   │   ├── filters/                     # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/                # Interceptors
│   │   │   └── transform.interceptor.ts
│   │   └── interfaces/                  # TypeScript interfaces
│   │       ├── user-payload.interface.ts
│   │       └── request-with-user.interface.ts
│   │
│   └── config/                          # ⚙️ Configuration
│       ├── database.config.ts
│       ├── jwt.config.ts
│       └── app.config.ts
│
├── prisma/                              # 🗄️ Database
│   ├── schema.prisma                    # Database schema
│   ├── migrations/                      # Migration files
│   └── seed.ts                          # Seed data
│
├── test/                                # 🧪 E2E Tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── dist/                                # 📦 Compiled output
├── node_modules/                        # 📚 Dependencies
│
├── .env                                 # 🔐 Environment variables
├── .env.example                         # 📝 Environment template
├── .gitignore                           # 🚫 Git ignore rules
├── package.json                         # 📋 Project dependencies
├── pnpm-lock.yaml                       # 🔒 Dependency lock file
├── tsconfig.json                        # ⚙️ TypeScript config
├── tsconfig.build.json                  # ⚙️ Build config
├── nest-cli.json                        # ⚙️ NestJS CLI config
└── README.md                            # 📖 Project documentation
```

## 🧩 Module Pattern

Each feature module follows this structure:

```
module-name/
├── module-name.module.ts      # Module definition
├── module-name.controller.ts  # HTTP endpoints
├── module-name.service.ts     # Business logic
├── dto/                       # Data Transfer Objects (validation)
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── response-*.dto.ts
└── entities/                  # Type definitions
    └── *.entity.ts
```

## 📝 File Naming Conventions

- **Modules**: `*.module.ts`
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **DTOs**: `*.dto.ts`
- **Entities**: `*.entity.ts`
- **Guards**: `*.guard.ts`
- **Interceptors**: `*.interceptor.ts`
- **Decorators**: `*.decorator.ts`
- **Interfaces**: `*.interface.ts`

## 🎯 Key Concepts

### DTOs (Data Transfer Objects)
- Validate incoming data
- Use `class-validator` decorators
- Located in `dto/` folders

### Entities
- Define data structure/types
- Used with Prisma models
- Located in `entities/` folders

### Guards
- Protect routes
- Check authentication & authorization
- Located in `common/guards/` or module-specific

### Decorators
- Custom functionality
- Simplify code
- Located in `common/decorators/`

### Interceptors
- Transform responses
- Add logging
- Located in `common/interceptors/`

## 🔐 Authentication Flow

```
1. User → POST /auth/register → Create account
2. User → POST /auth/login → Get JWT token
3. User → Request with Bearer token → Protected routes
4. JwtAuthGuard validates token → Allow/Deny access
```

## 📊 Database Schema (Prisma)

Main models:
- **User** (id, email, password, role, name)
- **Business** (id, name, ownerId, description)
- **Service** (id, businessId, name, duration, price)
- **Booking** (id, serviceId, userId, date, time, status)

## 🚀 Development Workflow

1. **Create a new module**: `nest g resource module-name`
2. **Define Prisma schema** in `prisma/schema.prisma`
3. **Generate migration**: `pnpm prisma migrate dev`
4. **Create DTOs** for validation
5. **Implement service logic**
6. **Create controller endpoints**
7. **Add guards/decorators** as needed
8. **Test with Postman/Insomnia**

## 📦 Dependencies Structure

```
@nestjs/core          # NestJS framework
@nestjs/common        # Common utilities
@nestjs/platform      # Express adapter
@prisma/client        # Database ORM
class-validator       # DTO validation
class-transformer     # DTO transformation
bcrypt                # Password hashing
jsonwebtoken          # JWT tokens
passport              # Authentication
```

## ✅ Next Steps

1. ✅ Structure created
2. ⏳ Setup Prisma schema
3. ⏳ Configure environment variables
4. ⏳ Create Auth module
5. ⏳ Create Users module
6. ⏳ Create other modules
7. ⏳ Add validation & guards
8. ⏳ Testing
9. ⏳ Docker setup
10. ⏳ Deployment

---

**Last Updated**: January 2024
**NestJS Version**: 10.x
**Node Version**: 20.x