/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChangeStatusDto,
  CreateBookingDto,
  FilterBookingDto,
  UpdateBookingDto,
} from './dto/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';
import { PaginatedResponseDto } from 'src/common/dto/pagination.index';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}
  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { serviceId, startTime, notes } = createBookingDto;

    // 1. Verificar que el servicio existe
    const service = await this.prisma.client.service.findUnique({
      where: { id: serviceId },
      include: {
        business: {
          select: { id: true, name: true, isActive: true },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // 2. Verificar que el negocio esté activo
    if (!service.business.isActive) {
      throw new BadRequestException('This business is not active');
    }

    // 3. Calcular endTime basado en la duración del servicio
    const bookingStartTime = new Date(startTime);
    const bookingEndTime = new Date(bookingStartTime);
    bookingEndTime.setMinutes(bookingEndTime.getMinutes() + service.duration);

    // 4. Validar disponibilidad
    await this.checkAvailability(serviceId, bookingStartTime, bookingEndTime);

    // 5. Crear la reserva
    return this.prisma.client.booking.create({
      data: {
        userId,
        serviceId,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        notes,
        status: 'PENDING', // Estado inicial
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          include: {
            business: {
              select: { id: true, name: true, address: true, phone: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.client.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        service: {
          include: {
            business: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                ownerId: true,
              },
            },
          },
        },
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }
  async findAll(filterDto: FilterBookingDto) {
    const { page = 1, limit = 10, status, startDate, endDate } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where dinámico
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.client.booking.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          service: {
            select: { id: true, name: true, duration: true, price: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.booking.count({ where }),
    ]);
    const meta = new PaginationMetaDto(total, page, limit);

    return new PaginatedResponseDto(bookings, meta);
  }

  async findMyBookings(userId: string, filterDto: FilterBookingDto) {
    const { page = 1, limit = 10, status, startDate, endDate } = filterDto;
    const skip = (page - 1) * limit;

    // Construir where dinámico
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.client.booking.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          service: {
            select: { id: true, name: true, duration: true, price: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.booking.count({ where }),
    ]);
    const meta = new PaginationMetaDto(total, page, limit);

    return new PaginatedResponseDto(bookings, meta);
  }
  async findBusinessBookings(
    businessId: string,
    userId: string,
    userRole: string,
    filterDto: FilterBookingDto,
  ) {
    // 1. Verificar que el negocio existe y el usuario es el dueño
    const business = await this.prisma.client.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not the owner of this business');
    }

    // 2. Obtener IDs de servicios del negocio
    const services = await this.prisma.client.service.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
      },
    });

    const serviceIds = services.map((s) => s.id);

    // 3. Buscar bookings de esos servicios
    const { page = 1, limit = 10, status, startDate, endDate } = filterDto;
    const skip = (page - 1) * limit;

    const where: any = {
      serviceId: { in: serviceIds },
    };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.client.booking.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          service: {
            select: { id: true, name: true, duration: true, price: true },
          },
        },
        orderBy: { startTime: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.client.booking.count({ where }),
    ]);

    const meta = new PaginationMetaDto(total, page, limit);
    return new PaginatedResponseDto(bookings, meta);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string) {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this booking');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'You can only update bookings in PENDING status',
      );
    }
    //Si está cambiando la fecha/hora, validar disponibilidad
    if (updateBookingDto.startTime) {
      const newStartTime = new Date(updateBookingDto.startTime);
      const newEndTime = new Date(newStartTime);
      newEndTime.setMinutes(newEndTime.getMinutes() + booking.service.duration);

      await this.checkAvailability(
        booking.serviceId,
        newStartTime,
        newEndTime,
        id,
      );

      return this.prisma.client.booking.update({
        where: { id },
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
          notes: updateBookingDto.notes,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          service: {
            include: {
              business: {
                select: { id: true, name: true, address: true, phone: true },
              },
            },
          },
        },
      });
    }
    //solo actualiza nota
    return this.prisma.client.booking.update({
      where: { id },
      data: {
        notes: updateBookingDto.notes,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          include: {
            business: {
              select: { id: true, name: true, address: true, phone: true },
            },
          },
        },
      },
    });
  }
  async changeStatus(
    id: string,
    changeStatus: ChangeStatusDto,
    userId: string,
    userRole: string,
  ) {
    const booking = await this.findOne(id);

    if (booking.service.business.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Only the business owner or admin can change booking status',
      );
    }

    const { status: newStatus } = changeStatus;

    const currentStatus = booking.status;
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus}`,
      );
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED'],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    return this.prisma.client.booking.update({
      where: { id },
      data: {
        status: newStatus,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          include: {
            business: {
              select: { id: true, name: true, address: true, phone: true },
            },
          },
        },
      },
    });
  }
  async cancel(id: string, userId: string, userRole: string) {
    const booking = await this.findOne(id);

    const isBookingOwner = booking.userId === userId;
    const isBusinessOwner = booking.service.business.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isBookingOwner && !isBusinessOwner && !isAdmin) {
      throw new ForbiddenException(
        'You can only cancel your own bookings or bookings from your business',
      );
    }

    // 3. Verificar que no esté ya cancelada o completada
    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    // 4. Cancelar (cambiar estado a CANCELLED)
    return this.prisma.client.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        service: {
          include: {
            business: {
              select: { id: true, name: true, address: true, phone: true },
            },
          },
        },
      },
    });
  }
  private async checkAvailability(
    serviceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ) {
    // 1. Verificar que no sea en el pasado
    const now = new Date();
    if (startTime < now) {
      throw new BadRequestException('Cannot book in the past');
    }

    // 2. Buscar conflictos de horario
    const whereClause: any = {
      serviceId,
      status: { in: ['PENDING', 'CONFIRMED'] }, // Solo reservas activas
      OR: [
        // Caso 1: Nueva reserva empieza durante una existente
        {
          startTime: { lte: startTime },
          endTime: { gt: startTime },
        },
        // Caso 2: Nueva reserva termina durante una existente
        {
          startTime: { lt: endTime },
          endTime: { gte: endTime },
        },
        // Caso 3: Nueva reserva envuelve una existente
        {
          startTime: { gte: startTime },
          endTime: { lte: endTime },
        },
      ],
    };

    // Si estamos actualizando, excluir la reserva actual
    if (excludeBookingId) {
      whereClause.id = { not: excludeBookingId };
    }

    const conflicts = await this.prisma.client.booking.findMany({
      where: whereClause,
    });

    if (conflicts.length > 0) {
      throw new ConflictException(
        'This time slot is not available. Please choose another time.',
      );
    }

    return true;
  }
}
