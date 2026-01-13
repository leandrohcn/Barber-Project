import { Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Service } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  create(createCatalogDto: CreateCatalogDto): Promise<Service> {
    return this.prisma.service.create({
      data: createCatalogDto,
    });
  }

  findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  findOne(id: number): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(id: number, updateServiceDto: UpdateCatalogDto): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: number): Promise<Service> {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
