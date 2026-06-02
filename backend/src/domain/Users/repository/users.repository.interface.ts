import type { users } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUsersRepository {
  create(organizationId: string, data: CreateUserDto): Promise<users>;
  findAll(organizationId: string): Promise<users[]>;
  findOne(organizationId: string, id: string): Promise<users | null>;
  findByEmail(email: string): Promise<users | null>;
  update(organizationId: string, id: string, data: UpdateUserDto): Promise<users>;
  updatePassword(organizationId: string, id: string, hashedPassword: string): Promise<users>;
  deactivate(organizationId: string, id: string): Promise<users>;
  delete(organizationId: string, id: string): Promise<users>;
}
