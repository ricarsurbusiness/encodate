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

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Throttle({ default: { ttl: 60000, limit: 6 } })
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Get()
  @Roles('ADMIN')
  findAll(@Query() filterDto: FilterBookingDto) {
    return this.bookingsService.findAll(filterDto);
  }

  @Get('my-bookings')
  findAllMyBookings(
    @CurrentUser('id') userId: string,
    @Query() filterDto: FilterBookingDto,
  ) {
    return this.bookingsService.findMyBookings(userId, filterDto);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
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
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.bookingsService.update(id, updateBookingDto, userId);
  }

  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
  ) {
    return this.bookingsService.cancel(id, userId, userRole);
  }
}
