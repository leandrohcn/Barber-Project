import { Injectable } from '@nestjs/common';
import type { users } from '@prisma/client';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthMapper {
  /**
   * Converte User entity para JwtPayload
   * Usado ao gerar token JWT
   */
  toJwtPayload(user: users): JwtPayloadDto {
    return {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };
  }

  /**
   * Converte User entity para AuthResponse
   * Usado na resposta do login/register
   */
  toAuthResponse(
    user: users,
    accessToken: string,
  ): {
    access_token: string;
    organizationId?: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role: string;
      organizationId: string;
    };
  } {
    return {
      access_token: accessToken,
      organizationId: user.organizationId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }
}