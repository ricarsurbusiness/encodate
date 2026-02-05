/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-useless-catch */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getProfile(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User ID is required');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.client.user.update({
        where: { id: userId },
        data: dto,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async changePassword(userId: string, ChangePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });
    //usuario existe?
    if (!user) throw new NotFoundException('User not found');

    //valida password
    const isPasswordValid = await bcrypt.compare(
      ChangePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    //cambia la password
    const newPassword = await bcrypt.hash(ChangePasswordDto.newPassword, 10);
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
    return { message: 'Password changed successfully' };
  }

  async findAll() {
    try {
      const users = await this.prisma.client.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return users;
    } catch (error: any) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.client.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const user = await this.prisma.client.user.update({
        where: { id },
        data: { role: updateRoleDto.role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User not found`);
      }
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.prisma.client.user.delete({ where: { id } });
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User not found`);
      }
      throw error;
    }
  }
}
