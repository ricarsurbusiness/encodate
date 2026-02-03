import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Role } from 'src/generated/enums';
import * as bcrypt from 'bcrypt';

type UserPayload = {
  id: string;
  email: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    const existingUser = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.client.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: Role.CLIENT,
      },
    });

    const token = this.generateToken(user);

    const response = new AuthResponseDto();
    response.accessToken = token;
    response.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role,
    };

    return response;
  }

  async login(loginDto: LoginDto) {
    // 1. Extraer datos
    const { email, password } = loginDto;

    // 2. Buscar usuario
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    // 3. Verificar si existe
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Generar token
    const token = this.generateToken(user);

    // 6. Devolver respuesta
    const response = new AuthResponseDto();
    response.accessToken = token;
    response.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role,
    };
    return response;
  }
  private generateToken(user: UserPayload): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
