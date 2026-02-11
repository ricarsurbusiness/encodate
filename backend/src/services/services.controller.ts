/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FilterServiceDto } from './dto/filter-service.dto';

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('businesses/:businessId/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async create(
    @Param('businessId') businessId: string,
    @Body() createServiceDto: CreateServiceDto,
    @CurrentUser() user: any,
  ) {
    return this.servicesService.createService(
      businessId,
      createServiceDto,
      user.id,
      user.role,
    );
  }

  @Get('businesses/:businessId/services')
  async findAll(
    @Param('businessId') businessId: string,
    @Query() filterServiceDto: FilterServiceDto,
  ) {
    return this.servicesService.findAllByBusiness(businessId, filterServiceDto);
  }

  @Get('services/:id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user: any,
  ) {
    return this.servicesService.update(
      id,
      updateServiceDto,
      user.id,
      user.role,
    );
  }

  @Delete('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.servicesService.remove(id, user.id, user.role);
  }
}
