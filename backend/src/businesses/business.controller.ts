/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  Query,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SearchBusinessDto } from './dto/search-business.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({
    summary: 'Crear nuevo negocio',
    description: 'Crea un nuevo negocio (requiere rol ADMIN o STAFF)',
  })
  @ApiResponse({ status: 201, description: 'Negocio creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @CurrentUser() user: any,
  ) {
    return this.businessService.createBusiness(createBusinessDto, user.id);
  }

  @ApiOperation({
    summary: 'Listar todos los negocios',
    description:
      'Devuelve una lista paginada de negocios con búsqueda opcional',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de negocios obtenida exitosamente',
  })
  @Get()
  async findAll(@Query() searchBusinessDto: SearchBusinessDto) {
    return this.businessService.findAll(searchBusinessDto);
  }

  @ApiOperation({
    summary: 'Obtener mis negocios',
    description: 'Devuelve los negocios del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Negocios del usuario obtenidos exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth('JWT-auth')
  @Get('my-businesses')
  @UseGuards(JwtAuthGuard)
  async findMyBusiness(@CurrentUser() user: any) {
    return this.businessService.findByOwner(user.id);
  }

  @ApiOperation({
    summary: 'Obtener negocio por ID',
    description: 'Devuelve la información de un negocio específico',
  })
  @ApiResponse({ status: 200, description: 'Negocio encontrado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @ApiOperation({
    summary: 'Actualizar negocio',
    description: 'Actualiza la información de un negocio (solo owner o admin)',
  })
  @ApiResponse({ status: 200, description: 'Negocio actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  @ApiBearerAuth('JWT-auth')
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

  @ApiOperation({
    summary: 'Eliminar negocio',
    description: 'Elimina un negocio del sistema (soft delete)',
  })
  @ApiResponse({ status: 200, description: 'Negocio eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.businessService.remove(id, user.id, user.role);
  }
}
