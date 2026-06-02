import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IFuncionariosRepository } from './funcionarios.repository.interface';
import type { funcionarios } from '@prisma/client';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';

@Injectable()
export class FuncionariosRepository implements IFuncionariosRepository {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateFuncionarioDto): Promise<funcionarios> {
    return this.prisma.funcionarios.create({
      data: {
        organizationId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        isAtivo: true,
      },
    });
  }

  async findAll(organizationId: string): Promise<funcionarios[]> {
    return this.prisma.funcionarios.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAllAtivos(organizationId: string): Promise<funcionarios[]> {
    return this.prisma.funcionarios.findMany({
      where: {
        organizationId,
        isAtivo: true,
        deletedAt: null,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<funcionarios | null> {
    return this.prisma.funcionarios.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async update(organizationId: string, id: string, data: UpdateFuncionarioDto): Promise<funcionarios> {
    return this.prisma.funcionarios.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
      },
    });
  }

  async deactivate(organizationId: string, id: string): Promise<funcionarios> {
    return this.prisma.funcionarios.update({
      where: { id },
      data: { isAtivo: false },
    });
  }

  async delete(organizationId: string, id: string): Promise<funcionarios> {
    return this.prisma.funcionarios.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countAtivos(organizationId: string): Promise<number> {
    return this.prisma.funcionarios.count({
      where: {
        organizationId,
        isAtivo: true,
        deletedAt: null,
      },
    });
  }

  async count(organizationId: string): Promise<number> {
    return this.prisma.funcionarios.count({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
  }
}
