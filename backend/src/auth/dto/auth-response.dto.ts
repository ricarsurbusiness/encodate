/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Role } from 'src/generated/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (válido por 15 minutos)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token (válido por 7 días, se rota en cada uso)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  refreshToken: string;

  @ApiPropertyOptional({
    description: 'Información del usuario',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'f272e392-20f6-439b-b8f5-ca5c4m0e045e',
      },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      phone: { type: 'string', example: '+1234567890' },
      role: {
        type: 'string',
        enum: ['CLIENT', 'BUSINESS_OWNER', 'ADMIN'],
        example: 'CLIENT',
      },
    },
  })
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: Role;
  };
}
