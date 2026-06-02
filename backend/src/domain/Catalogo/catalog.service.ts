import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import type { catalogs } from '@prisma/client';
import type { ICatalogRepository } from './repository/catalog.repository.interface';


@Injectable()
export class CatalogService {
  constructor(
    @Inject('ICatalogRepository') private catalogRepository: ICatalogRepository
  ) {}

  /**
   * Criar novo catálogo (serviço)
   * ✅ Multi-tenant: Cria para organizationId específico
   */
  async create(
    organizationId: string,
    createCatalogDto: CreateCatalogDto,
  ): Promise<catalogs> {
    return this.catalogRepository.create(organizationId, createCatalogDto);
  }

  /**
   * Listar catálogos da organização
   * ✅ Filtra por organizationId
   */
  async findAll(organizationId: string): Promise<catalogs[]> {
    return this.catalogRepository.findAll(organizationId);
  }

  /**
   * Buscar catálogo por ID
   * ✅ Valida isolamento
   */
  async findOne(organizationId: string, id: string): Promise<catalogs> {
    const catalogo = await this.catalogRepository.findOne(organizationId, id);

    if (!catalogo) {
      throw new NotFoundException('Catálogo não encontrado');
    }

    if (catalogo.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este catálogo',
      );
    }

    return catalogo;
  }

  /**
   * Atualizar catálogo
   * ✅ Valida isolamento
   */
  async update(
    organizationId: string,
    id: string,
    updateCatalogDto: UpdateCatalogDto,
  ): Promise<catalogs> {
    await this.findOne(organizationId, id);

    return this.catalogRepository.update(organizationId, id, updateCatalogDto);
  }

  /**
   * Deletar catálogo (soft delete)
   * ✅ Valida isolamento
   */
  async remove(organizationId: string, id: string): Promise<catalogs> {
    await this.findOne(organizationId, id);

    return this.catalogRepository.delete(organizationId, id);
  }
}
