import { Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Catalogo } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  create(createCatalogDto: CreateCatalogDto) {
    
    return this.prisma.catalogo.create({
      data: {
        ...createCatalogDto,
        description: createCatalogDto.description ?? '',
      },
    }); 
  }

  findAll(): Promise<Catalogo[]> {
    return this.prisma.catalogo.findMany();
  }

  findOne(id: number): Promise<Catalogo | null> {
    return this.prisma.catalogo.findUnique({
      where: { id },
    });
  }

  update(id: number, updateServiceDto: UpdateCatalogDto): Promise<Catalogo> {
    return this.prisma.catalogo.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: number): Promise<Catalogo> {
    return this.prisma.catalogo.delete({
      where: { id },
    });
  }
}
