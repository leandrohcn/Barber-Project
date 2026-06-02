import { Injectable } from '@nestjs/common';
import type { users } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { User as UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersMapper {
  /**
   * Converte dados brutos do Prisma para Entity
   */
  toDomain(raw: any): users {
    const user = plainToClass(UserEntity, raw);
    return user as any;
  }

  /**
   * Converte User entity para Response DTO
   */
  toResponse(user: users): Omit<users, 'password'> {
    const { password, ...response } = user;
    return response;
  }
}
