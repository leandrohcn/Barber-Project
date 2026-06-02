import type { funcionarios } from '@prisma/client';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';

export interface IFuncionariosRepository {
  create(organizationId: string, data: CreateFuncionarioDto): Promise<funcionarios>;
  findAll(organizationId: string): Promise<funcionarios[]>;
  findAllAtivos(organizationId: string): Promise<funcionarios[]>;
  findOne(organizationId: string, id: string): Promise<funcionarios | null>;
  update(organizationId: string, id: string, data: UpdateFuncionarioDto): Promise<funcionarios>;
  deactivate(organizationId: string, id: string): Promise<funcionarios>;
  delete(organizationId: string, id: string): Promise<funcionarios>;
  countAtivos(organizationId: string): Promise<number>;
  count(organizationId: string): Promise<number>;
}
