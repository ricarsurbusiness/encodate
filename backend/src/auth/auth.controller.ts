/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario con rol CLIENT por defecto',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Throttle({ default: { ttl: 60000, limit: 6 } })
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica al usuario y devuelve access token + refresh token',
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Usa el refresh token para obtener un nuevo access token y nuevo refresh token (Token Rotation)',
  })
  @ApiResponse({
    status: 201,
    description: 'Tokens renovados exitosamente',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido, expirado o revocado',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas peticiones (Rate limit: 10/min)',
  })
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Revoca el refresh token especificado (cierra una sesión específica)',
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión cerrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @ApiOperation({
    summary: 'Cerrar todas las sesiones',
    description:
      'Revoca todos los refresh tokens del usuario (cierra sesión en todos los dispositivos)',
  })
  @ApiResponse({
    status: 201,
    description: 'Todas las sesiones cerradas exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'All sessions closed successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiBearerAuth('JWT-auth')
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@CurrentUser('id') userId: string) {
    return this.authService.logoutAll(userId);
  }

  @ApiOperation({
    summary: 'Obtener perfil del usuario actual',
    description: 'Devuelve la información del usuario autenticado (Solo ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos (requiere rol ADMIN)',
  })
  @ApiBearerAuth('JWT-auth')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return { message: 'current user info', user };
  }
}
