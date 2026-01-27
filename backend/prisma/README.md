# Prisma Directory

This directory contains all database-related files for the booking system.

## Structure

```
prisma/
├── schema.prisma       # Database schema definition
├── migrations/         # Database migration files
└── seed.ts            # Seed data for development
```

## Setup

1. Initialize Prisma schema (will be created)
2. Run migrations: `pnpm prisma migrate dev`
3. Generate Prisma Client: `pnpm prisma generate`
4. Seed database: `pnpm db:seed`

## Useful Commands

```bash
# Generate Prisma Client
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio (DB GUI)
pnpm prisma studio

# Reset database
pnpm prisma migrate reset

# Format schema file
pnpm prisma format
```

## Database Models

- **User**: System users (admin, staff, client)
- **Business**: Business entities
- **Service**: Services offered by businesses
- **Booking**: Reservation records
- **Availability**: Staff availability schedule