import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IAuthRepository } from './auth.repository.interface';
import type { users } from '@prisma/client';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: Omit<RegisterDto, 'organizationId'> & { organizationId: string; password: string },
  ): Promise<users> {
    return this.prisma.users.create({
      data: {
        organizationId: data.organizationId,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'OWNER',
        isActive: true,
      },
    });
  }

  async findUserByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }
}
