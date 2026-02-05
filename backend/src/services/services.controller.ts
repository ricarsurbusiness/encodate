/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
    return this.servicesService.createService(businessId, createServiceDto);
  }

  @Get('businesses/:businessId/services')
  async findAll(@Param('businessId') businessId: string) {
    return this.servicesService.findAllByBusiness(businessId);
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
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.servicesService.remove(id);
  }
}
