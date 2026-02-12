/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from 'src/common/dto/pagination.index';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Obtener mi perfil',
    description: 'Devuelve la información del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @Get('me')
  getMyProfile(@CurrentUser() user) {
    return this.usersService.getProfile(user.id);
  }
  @ApiOperation({
    summary: 'Actualizar mi perfil',
    description: 'Actualiza la información del usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @Patch('me')
  updateMyProfile(@CurrentUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }
  @ApiOperation({
    summary: 'Cambiar mi contraseña',
    description: 'Cambia la contraseña del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  @Put('me/password')
  updateMyPassword(
    @CurrentUser() user,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @ApiOperation({
    summary: 'Listar todos los usuarios (Admin)',
    description: 'Devuelve una lista paginada de todos los usuarios',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)' })
  @Get()
  @Roles('ADMIN')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOperation({
    summary: 'Obtener usuario por ID (Admin)',
    description: 'Devuelve la información de un usuario específico',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  @Roles('ADMIN')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @ApiOperation({
    summary: 'Actualizar rol de usuario (Admin)',
    description: 'Cambia el rol de un usuario específico',
  })
  @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Patch(':id/role')
  @Roles('ADMIN')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @ApiOperation({
    summary: 'Eliminar usuario (Admin)',
    description: 'Elimina un usuario del sistema',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos (requiere ADMIN)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
