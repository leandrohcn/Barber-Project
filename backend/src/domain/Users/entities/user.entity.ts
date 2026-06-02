import { users as PrismaUser, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User implements PrismaUser {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;

  @Exclude()
  password: string;

  role: Role;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<PrismaUser>) {
    Object.assign(this, partial);
  }
}