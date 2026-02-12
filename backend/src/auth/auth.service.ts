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
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    private refreshTokenService: RefreshTokenService,
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
    const response = new AuthResponseDto();
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
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // 6. Devolver respuesta
    const response = new AuthResponseDto();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role,
    };
    return response;
  }
  private async generateTokens(user: UserPayload) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
    );
    return { accessToken, refreshToken };
  }
  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const tokenRecord =
      await this.refreshTokenService.validateRefreshToken(refreshToken);
    const user = await this.prisma.client.user.findUnique({
      where: { id: tokenRecord.userId },
    });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user);
    return { accessToken, refreshToken: newRefreshToken };
  }
  async logout(refreshTokenDto: RefreshTokenDto) {
    //Extraer token
    const { refreshToken } = refreshTokenDto;

    //Revocar el token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    //Devolver confirmación
    return {
      message: 'Logged out successfully',
    };
  }
  async logoutAll(userId: string) {
    //Revocar todos los tokens del usuario
    await this.refreshTokenService.revokeAllUserTokens(userId);

    //Devolver confirmación
    return {
      message: 'All sessions closed successfully',
    };
  }
}
