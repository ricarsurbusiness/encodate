import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService) {}
  async generateRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();

    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.client.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  //Validar refresh token
  async validateRefreshToken(token: string) {
    //  todos los tokens activos (no revocados, no expirados)
    const tokens = await this.prisma.client.refreshToken.findMany({
      where: {
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    // Comparar el token con cada hash en BD
    for (const tokenRecord of tokens) {
      const isValid = await bcrypt.compare(token, tokenRecord.token);

      if (isValid) {
        // Token válido encontrado
        return tokenRecord;
      }
    }

    // No se encontró match
    throw new UnauthorizedException('Invalid refresh token');
  }

  //Revocar un token específico
  async revokeRefreshToken(token: string): Promise<void> {
    //Encontrar el token
    const tokenRecord = await this.validateRefreshToken(token);

    //Marcarlo como revocado
    await this.prisma.client.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });
  }

  // Revocar todos los tokens de un usuario
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.client.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanExpiredTokens() {
    //Eliminar tokens expirados
    const result = await this.prisma.client.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(), // lt = less than (menor que)
        },
      },
    });

    //Log de cuántos se eliminaron
    console.log(`[Cron] Cleaned ${result.count} expired refresh tokens`);
    return result.count;
  }
}
