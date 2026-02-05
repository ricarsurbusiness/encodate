/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @CurrentUser() user: any,
  ) {
    return this.businessService.createBusiness(createBusinessDto, user.id);
  }

  @Get()
  async findAll() {
    return this.businessService.findAll();
  }

  @Get('my-businesses')
  @UseGuards(JwtAuthGuard)
  async findMyBusiness(@CurrentUser() user: any) {
    return this.businessService.findByOwner(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: any,
  ) {
    return this.businessService.updateBusiness(
      id,
      updateBusinessDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.businessService.remove(id, user.id, user.role);
  }
}
