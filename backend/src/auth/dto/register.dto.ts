import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/generated/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'SecurePass123',
    minLength: 8,
    required: true,
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Teléfono del usuario',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario (solo para admins)',
    enum: Role,
    example: Role.CLIENT,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
