/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(businessId: string, createServiceDto: CreateServiceDto) {
    const business = await this.prisma.client.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    try {
      const service = await this.prisma.client.service.create({
        data: {
          ...createServiceDto,
          business: { connect: { id: businessId } },
        },
        include: {
          business: {
            select: { id: true, name: true },
          },
        },
      });
      return service;
    } catch (error) {
      throw error;
    }
  }
  async findAllByBusiness(businessId: string) {
    return await this.prisma.client.service.findMany({
      where: { businessId },
      include: {
        business: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
  async findOne(id: string) {
    const service = await this.prisma.client.service.findUnique({
      where: { id },
      include: {
        business: {
          select: { id: true, name: true, address: true, phone: true },
        },
      },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }
  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);
    try {
      const updatedService = await this.prisma.client.service.update({
        where: { id },
        data: updateServiceDto,
        include: {
          business: {
            select: { id: true, name: true },
          },
        },
      });
      return updatedService;
    } catch (error) {
      throw error;
    }
  }
  async remove(id: string) {
    await this.findOne(id);

    try {
      return await this.prisma.client.service.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
