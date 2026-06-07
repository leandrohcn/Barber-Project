import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gerar um convite para um funcionário
   */
  async generateInvite(organizationId: string, email: string) {
    // Verificar se o email já está convidado ou registrado
    const existingInvite = await this.prisma.invites.findFirst({
      where: {
        organizationId,
        email,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvite) {
      throw new BadRequestException('Esse email já tem um convite ativo');
    }

    // Verificar se o email já está registrado na organização
    const existingUser = await this.prisma.users.findFirst({
      where: {
        organizationId,
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Esse email já está registrado na organização');
    }

    // Gerar token único
    const token = randomBytes(32).toString('hex');

    // Criar convite com expiração de 7 dias
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await this.prisma.invites.create({
      data: {
        organizationId,
        email,
        token,
        expiresAt,
      },
    });

    return {
      invite,
      inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?invite=${token}`,
      token,
    };
  }

  /**
   * Validar um convite
   */
  async validateInvite(token: string) {
    const invite = await this.prisma.invites.findUnique({
      where: { token },
      include: {
        organizations: true,
      },
    });

    if (!invite) {
      throw new BadRequestException('Convite inválido');
    }

    if (invite.isUsed) {
      throw new BadRequestException('Esse convite já foi utilizado');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Esse convite expirou');
    }

    return invite;
  }

  /**
   * Marcar um convite como utilizado
   */
  async markAsUsed(token: string) {
    return this.prisma.invites.update({
      where: { token },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });
  }
}
