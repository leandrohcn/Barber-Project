import type { users } from '@prisma/client';
import { RegisterDto } from '../dto/register.dto';

export interface IAuthRepository {
  createUser(data: Omit<RegisterDto, 'organizationId'> & { organizationId: string; password: string }): Promise<users>;
  findUserByEmail(email: string): Promise<users | null>;
  findUserById(id: string): Promise<users | null>;
}
