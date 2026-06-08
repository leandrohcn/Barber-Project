import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import type { organizations } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Criar nova organização (nova barbearia)
   */
  async create(dto: CreateOrganizationDto): Promise<organizations> {
    // Validar subdomain único
    const existingBySubdomain = await this.prisma.organizations.findUnique({
      where: { subdomain: dto.subdomain },
    });

    if (existingBySubdomain) {
      throw new ConflictException(
        `Subdomain "${dto.subdomain}" já está em uso`,
      );
    }

    // Validar slug único
    const existingBySlug = await this.prisma.organizations.findUnique({
      where: { slug: dto.slug },
    });

    if (existingBySlug) {
      throw new ConflictException(`Slug "${dto.slug}" já está em uso`);
    }

    return this.prisma.organizations.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        subdomain: dto.subdomain,
        primaryColor: dto.primaryColor || '#000000',
        secondaryColor: dto.secondaryColor || '#FFFFFF',
        settings: dto.settings || {},
      },
    });
  }

  /**
   * Buscar organização por subdomain (usado no frontend)
   */
  async findBySubdomain(subdomain: string): Promise<organizations | null> {
    return this.prisma.organizations.findUnique({
      where: { subdomain },
    });
  }

  /**
   * Buscar organização por ID
   */
  async findById(id: string): Promise<organizations> {
    const org = await this.prisma.organizations.findUnique({
      where: { id },
    });

    if (!org || org.deletedAt) {
      throw new NotFoundException(`Organização ${id} não encontrada`);
    }

    return org;
  }

  /**
   * Buscar organização por slug
   */
  async findBySlug(slug: string): Promise<organizations | null> {
    return this.prisma.organizations.findUnique({
      where: { slug },
    });
  }

  /**
   * Listar todas as organizações (apenas admin)
   */
  async findAll(): Promise<organizations[]> {
    return this.prisma.organizations.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Atualizar organização
   */
  async update(
    id: string,
    dto: UpdateOrganizationDto,
  ): Promise<organizations> {
    // findById vai lançar NotFoundException se não encontrar
    const org = await this.findById(id);

    // Se mudou subdomain, validar unicidade
    if (dto.subdomain && dto.subdomain !== org.subdomain) {
      const existing = await this.prisma.organizations.findUnique({
        where: { subdomain: dto.subdomain },
      });

      if (existing) {
        throw new ConflictException(
          `Subdomain "${dto.subdomain}" já está em uso`,
        );
      }
    }

    return this.prisma.organizations.update({
      where: { id },
      data: {
        name: dto.name,
        subdomain: dto.subdomain,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        logo: dto.logo,
        settings: dto.settings,
      },
    });
  }

  /**
   * Soft delete de organização
   */
  async softDelete(id: string): Promise<organizations> {
    return this.prisma.organizations.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Contar usuários de uma organização
   */
  async countUsers(organizationId: string): Promise<number> {
    return this.prisma.users.count({
      where: { organizationId },
    });
  }

  /**
   * Contar agendamentos de uma organização
   */
  async countAgendamentos(organizationId: string): Promise<number> {
    return this.prisma.agendamentos.count({
      where: { organizationId },
    });
  }

  /**
   * Obter estatísticas gerais de uma organização
   */
  async getStats(organizationId: string) {
    const [users, funcionarios, agendamentos, servicos] = await Promise.all([
      this.prisma.users.count({ where: { organizationId } }),
      this.prisma.funcionarios.count({
        where: { organizationId, isAtivo: true },
      }),
      this.prisma.agendamentos.count({
        where: { organizationId },
      }),
      this.prisma.catalogs.count({
        where: { organizationId, isAtivo: true },
      }),
    ]);

    return {
      users,
      funcionarios,
      agendamentos,
      servicos,
    };
  }
}
