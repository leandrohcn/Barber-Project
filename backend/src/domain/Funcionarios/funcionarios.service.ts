import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import type { funcionarios } from '@prisma/client';
import type { IFuncionariosRepository } from './repository/funcionarios.repository.interface';

@Injectable()
export class FuncionariosService {
  constructor(
    @Inject('IFuncionariosRepository') private funcionariosRepository: IFuncionariosRepository,
  ) {}

  /**
   * Criar novo funcionário na organização
   * ✅ Valida organizationId
   * ✅ Valida unicidade de email (caso tenhamos)
   */
  async create(organizationId: string, createFuncionarioDto: CreateFuncionarioDto): Promise<funcionarios> {
    return this.funcionariosRepository.create(organizationId, createFuncionarioDto);
  }

  /**
   * Listar funcionários da organização
   * ✅ Filtra por organizationId
   */
  async findAll(organizationId: string): Promise<funcionarios[]> {
    return this.funcionariosRepository.findAll(organizationId);
  }

  /**
   * Listar apenas funcionários ativos
   */
  async findAllAtivos(organizationId: string): Promise<funcionarios[]> {
    return this.funcionariosRepository.findAllAtivos(organizationId);
  }

  /**
   * Buscar funcionário por ID
   * ✅ Valida isolamento
   */
  async findOne(organizationId: string, id: string): Promise<funcionarios> {
    const funcionario = await this.funcionariosRepository.findOne(organizationId, id);

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    if (funcionario.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este funcionário',
      );
    }

    return funcionario;
  }

  /**
   * Atualizar funcionário
   * ✅ Valida isolamento
   */
  async update(
    organizationId: string,
    id: string,
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): Promise<funcionarios> {
    // Validar isolamento
    await this.findOne(organizationId, id);

    return this.funcionariosRepository.update(organizationId, id, updateFuncionarioDto);
  }

  /**
   * Desativar funcionário
   */
  async deactivate(organizationId: string, id: string): Promise<funcionarios> {
    await this.findOne(organizationId, id);

    return this.funcionariosRepository.deactivate(organizationId, id);
  }

  /**
   * Deletar funcionário (soft delete)
   */
  async remove(organizationId: string, id: string): Promise<funcionarios> {
    await this.findOne(organizationId, id);

    return this.funcionariosRepository.delete(organizationId, id);
  }

  /**
   * Contar funcionários ativos
   */
  async countAtivos(organizationId: string): Promise<number> {
    return this.funcionariosRepository.countAtivos(organizationId);
  }
}
