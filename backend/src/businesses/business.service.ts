/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import {
  PaginationMetaDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.index';
import { SearchBusinessDto } from './dto/search-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}
  async createBusiness(createBusinessDto: CreateBusinessDto, ownerId: string) {
    try {
      return await this.prisma.client.business.create({
        data: {
          ...createBusinessDto,
          owner: { connect: { id: ownerId } },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ConflictException('Owner user not found');
      }
      throw error;
    }
  }
  async findAll(searchBusinessDto: SearchBusinessDto) {
    const { page = 1, limit = 10, search } = searchBusinessDto;
    const where: any = { isActive: true };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }; //mode: 'insensitive' para búsque sin importar mayúsculas/minúsculas
    }

    const [businesses, total] = await Promise.all([
      this.prisma.client.business.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.client.business.count({
        where,
      }),
    ]);
    const meta = new PaginationMetaDto(total, page, limit);

    return new PaginatedResponseDto(businesses, meta);
  }
  async findOne(id: string) {
    const business = await this.prisma.client.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: true,
      },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }

    return business;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.client.business.findMany({
      where: {
        ownerId,
        isActive: true,
      },
      include: {
        services: true,
        _count: {
          select: {
            services: true,
            staff: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    // 1. Verificar que existe
    const business = await this.findOne(id);

    // 2. Verificar ownership
    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not the owner of this business');
    }

    // 3. Soft-delete
    return this.prisma.client.business.update({
      where: { id },
      data: { isActive: false },
    });
  }
  async updateBusiness(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
    userId: string,
    userRole: string,
  ) {
    // 1. Verificar que existe
    const business = await this.findOne(id);

    // 2. Verificar ownership
    if (business.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You are not the owner of this business');
    }

    // 3. Actualizar
    try {
      return await this.prisma.client.business.update({
        where: { id },
        data: updateBusinessDto,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Business not found');
      }
      throw error;
    }
  }
}
