import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// ── Fixed IDs — garantizan idempotencia (re-run safe) ─────────────────────────
const IDS = {
  business: 'a1b2c3d4-0000-0000-0000-000000000001',
  services: {
    corte:      'a1b2c3d4-0001-0000-0000-000000000001',
    coloracion: 'a1b2c3d4-0001-0000-0000-000000000002',
    manicure:   'a1b2c3d4-0001-0000-0000-000000000003',
    pedicure:   'a1b2c3d4-0001-0000-0000-000000000004',
    masaje:     'a1b2c3d4-0001-0000-0000-000000000005',
  },
  bookings: {
    completed: 'a1b2c3d4-0002-0000-0000-000000000001',
    confirmed: 'a1b2c3d4-0002-0000-0000-000000000002',
    pending:   'a1b2c3d4-0002-0000-0000-000000000003',
  },
};

// ── Contraseña única para todas las cuentas demo ──────────────────────────────
const DEMO_PASSWORD = 'Demo1234!';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('\n🌱 Iniciando seed...\n');

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ── 1. Usuarios demo ─────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@demo.com' },
    update: {},
    create: {
      email:    'admin@demo.com',
      password: hashed,
      name:     'Admin Demo',
      role:     'ADMIN',
      phone:    '+1 555-0100',
    },
  });

  const owner = await prisma.user.upsert({
    where:  { email: 'owner@demo.com' },
    update: {},
    create: {
      email:    'owner@demo.com',
      password: hashed,
      name:     'María García',
      role:     'STAFF',
      phone:    '+1 555-0101',
    },
  });

  const client = await prisma.user.upsert({
    where:  { email: 'client@demo.com' },
    update: {},
    create: {
      email:    'client@demo.com',
      password: hashed,
      name:     'Carlos López',
      role:     'CLIENT',
      phone:    '+1 555-0102',
    },
  });

  // ── 2. Negocio demo ──────────────────────────────────────────────────────
  const business = await prisma.business.upsert({
    where:  { id: IDS.business },
    update: {},
    create: {
      id:          IDS.business,
      name:        'Salón de Belleza Demo',
      description: 'Centro de estética y bienestar. Servicios de alta calidad para tu cuidado personal.',
      address:     'Av. Principal 123, Ciudad Demo',
      phone:       '+1 555-0200',
      isActive:    true,
      ownerId:     owner.id,
    },
  });

  // ── 3. Servicios ─────────────────────────────────────────────────────────
  const corte = await prisma.service.upsert({
    where:  { id: IDS.services.corte },
    update: {},
    create: {
      id:          IDS.services.corte,
      name:        'Corte de Cabello',
      description: 'Corte personalizado con lavado y secado incluido.',
      duration:    30,
      price:       15,
      businessId:  business.id,
    },
  });

  await prisma.service.upsert({
    where:  { id: IDS.services.coloracion },
    update: {},
    create: {
      id:          IDS.services.coloracion,
      name:        'Coloración',
      description: 'Tinte completo con fijador y brillo.',
      duration:    90,
      price:       45,
      businessId:  business.id,
    },
  });

  const manicure = await prisma.service.upsert({
    where:  { id: IDS.services.manicure },
    update: {},
    create: {
      id:          IDS.services.manicure,
      name:        'Manicure',
      description: 'Limado, cutícula y esmalte de tu elección.',
      duration:    45,
      price:       20,
      businessId:  business.id,
    },
  });

  await prisma.service.upsert({
    where:  { id: IDS.services.pedicure },
    update: {},
    create: {
      id:          IDS.services.pedicure,
      name:        'Pedicure',
      description: 'Tratamiento completo para tus pies.',
      duration:    60,
      price:       25,
      businessId:  business.id,
    },
  });

  const masaje = await prisma.service.upsert({
    where:  { id: IDS.services.masaje },
    update: {},
    create: {
      id:          IDS.services.masaje,
      name:        'Masaje Relajante',
      description: 'Masaje corporal completo con aceites esenciales.',
      duration:    60,
      price:       40,
      businessId:  business.id,
    },
  });

  // ── 4. Reservas (fechas relativas a hoy para que siempre sean válidas) ───
  const now = new Date();

  // Hace 7 días — COMPLETED
  const pastStart = new Date(now);
  pastStart.setDate(pastStart.getDate() - 7);
  pastStart.setHours(10, 0, 0, 0);
  const pastEnd = new Date(pastStart);
  pastEnd.setMinutes(pastEnd.getMinutes() + corte.duration);

  await prisma.booking.upsert({
    where:  { id: IDS.bookings.completed },
    update: { startTime: pastStart, endTime: pastEnd },
    create: {
      id:        IDS.bookings.completed,
      startTime: pastStart,
      endTime:   pastEnd,
      status:    'COMPLETED',
      notes:     'Cliente satisfecho con el resultado.',
      serviceId: corte.id,
      userId:    client.id,
    },
  });

  // Mañana — CONFIRMED
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(11, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setMinutes(tomorrowEnd.getMinutes() + manicure.duration);

  await prisma.booking.upsert({
    where:  { id: IDS.bookings.confirmed },
    update: { startTime: tomorrowStart, endTime: tomorrowEnd },
    create: {
      id:        IDS.bookings.confirmed,
      startTime: tomorrowStart,
      endTime:   tomorrowEnd,
      status:    'CONFIRMED',
      notes:     'Esmalte color rojo.',
      serviceId: manicure.id,
      userId:    client.id,
    },
  });

  // En 7 días — PENDING
  const nextWeekStart = new Date(now);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  nextWeekStart.setHours(15, 0, 0, 0);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setMinutes(nextWeekEnd.getMinutes() + masaje.duration);

  await prisma.booking.upsert({
    where:  { id: IDS.bookings.pending },
    update: { startTime: nextWeekStart, endTime: nextWeekEnd },
    create: {
      id:        IDS.bookings.pending,
      startTime: nextWeekStart,
      endTime:   nextWeekEnd,
      status:    'PENDING',
      notes:     null,
      serviceId: masaje.id,
      userId:    client.id,
    },
  });

  // ── Resumen ───────────────────────────────────────────────────────────────
  console.log('──────────────────────────────────────────────────────');
  console.log('✅  Seed completado!');
  console.log('──────────────────────────────────────────────────────');
  console.log(`🔑  Contraseña de todas las cuentas demo: ${DEMO_PASSWORD}`);
  console.log('');
  console.log(`👤  Admin        →  admin@demo.com   (ADMIN)`);
  console.log(`🏪  Propietaria  →  owner@demo.com   (STAFF)`);
  console.log(`🙋  Cliente      →  client@demo.com  (CLIENT)`);
  console.log('');
  console.log(`🏢  Negocio:  ${business.name}`);
  console.log(`💄  Servicios: Corte · Coloración · Manicure · Pedicure · Masaje`);
  console.log(`📅  Reservas: 1 completada (hace 7d) · 1 confirmada (mañana) · 1 pendiente (en 7d)`);
  console.log('──────────────────────────────────────────────────────\n');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
