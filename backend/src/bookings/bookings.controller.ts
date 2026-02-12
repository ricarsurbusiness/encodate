/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChangeStatusDto, FilterBookingDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({
    summary: 'Crear nueva reserva',
    description: 'Crea una nueva reserva para un servicio específico',
  })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o conflicto de horario',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas peticiones (Rate limit: 6/min)',
  })
  @Throttle({ default: { ttl: 60000, limit: 6 } })
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @ApiOperation({
    summary: 'Listar todas las reservas (Admin)',
    description:
      'Devuelve una lista paginada de todas las reservas del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)' })
  @Get()
  @Roles('ADMIN')
  findAll(@Query() filterDto: FilterBookingDto) {
    return this.bookingsService.findAll(filterDto);
  }

  @ApiOperation({
    summary: 'Obtener mis reservas',
    description: 'Devuelve las reservas del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservas del usuario obtenidas exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @Get('my-bookings')
  findAllMyBookings(
    @CurrentUser('id') userId: string,
    @Query() filterDto: FilterBookingDto,
  ) {
    return this.bookingsService.findMyBookings(userId, filterDto);
  }

  @ApiOperation({
    summary: 'Obtener reservas de un negocio',
    description:
      'Devuelve las reservas de un negocio específico (solo owner o admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservas del negocio obtenidas exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  @Get('businesses/:businessId')
  findBusinessBookings(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Query() filterDto: FilterBookingDto,
  ) {
    return this.bookingsService.findBusinessBookings(
      businessId,
      userId,
      userRole,
      filterDto,
    );
  }

  @ApiOperation({
    summary: 'Obtener reserva por ID',
    description: 'Devuelve la información de una reserva específica',
  })
  @ApiResponse({ status: 200, description: 'Reserva encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
  @ApiOperation({
    summary: 'Cambiar estado de reserva',
    description:
      'Cambia el estado de una reserva (PENDING, CONFIRMED, CANCELLED, COMPLETED)',
  })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Transición de estado inválida' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.bookingsService.changeStatus(
      id,
      changeStatusDto,
      userId,
      userRole,
    );
  }
  @ApiOperation({
    summary: 'Actualizar reserva',
    description: 'Actualiza los datos de una reserva existente',
  })
  @ApiResponse({ status: 200, description: 'Reserva actualizada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.update(id, updateBookingDto, userId);
  }

  @ApiOperation({
    summary: 'Cancelar reserva',
    description: 'Cancela una reserva (cambia estado a CANCELLED)',
  })
  @ApiResponse({ status: 200, description: 'Reserva cancelada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.bookingsService.cancel(id, userId, userRole);
  }
}
