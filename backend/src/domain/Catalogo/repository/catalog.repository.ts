import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ICatalogRepository } from './catalog.repository.interface';
import type { catalogs } from '@prisma/client';
import { CreateCatalogDto } from '../dto/create-catalog.dto';
import { UpdateCatalogDto } from '../dto/update-catalog.dto';

@Injectable()
export class CatalogRepository implements ICatalogRepository {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateCatalogDto): Promise<catalogs> {
    return this.prisma.catalogs.create({
      data: {
        organizationId,
        ...data,
      },
    });
  }

  async findAll(organizationId: string): Promise<catalogs[]> {
    return this.prisma.catalogs.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { ordem: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<catalogs | null> {
    return this.prisma.catalogs.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async update(organizationId: string, id: string, data: UpdateCatalogDto): Promise<catalogs> {
    return this.prisma.catalogs.update({
      where: { id },
      data,
    });
  }

  async delete(organizationId: string, id: string): Promise<catalogs> {
    return this.prisma.catalogs.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
