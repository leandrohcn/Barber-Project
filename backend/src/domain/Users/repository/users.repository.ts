import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IUsersRepository } from './users.repository.interface';
import type { users } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, data: CreateUserDto): Promise<users> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.users.create({
      data: {
        organizationId,
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: (data.role || 'STAFF') as any,
        isActive: true,
      },
    });
  }

  async findAll(organizationId: string): Promise<users[]> {
    return this.prisma.users.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<users | null> {
    return this.prisma.users.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  async findByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async update(organizationId: string, id: string, data: UpdateUserDto): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: {
        ...data,
      } as any,
    });
  }

  async updatePassword(organizationId: string, id: string, hashedPassword: string): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async deactivate(organizationId: string, id: string): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async delete(organizationId: string, id: string): Promise<users> {
    return this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
