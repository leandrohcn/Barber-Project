import type { catalogs } from '@prisma/client';
import { CreateCatalogDto } from '../dto/create-catalog.dto';
import { UpdateCatalogDto } from '../dto/update-catalog.dto';

export interface ICatalogRepository {
  create(organizationId: string, data: CreateCatalogDto): Promise<catalogs>;
  findAll(organizationId: string): Promise<catalogs[]>;
  findOne(organizationId: string, id: string): Promise<catalogs | null>;
  update(organizationId: string, id: string, data: UpdateCatalogDto): Promise<catalogs>;
  delete(organizationId: string, id: string): Promise<catalogs>;
}
