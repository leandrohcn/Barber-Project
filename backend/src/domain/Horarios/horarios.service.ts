import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import type { horarios_funcionamento } from '@prisma/client';
import type { IHorariosRepository } from './repository/horarios.repository.interface';


@Injectable()
export class HorariosService {
  constructor(
    @Inject('IHorariosRepository') private horariosRepository: IHorariosRepository,
  ) {}

  /**
   * Criar novo horário para funcionário
   * ✅ Valida organizationId
   * ✅ Valida que funcionário pertence à organização
   */
  async create(organizationId: string, createHorarioDto: CreateHorarioDto): Promise<horarios_funcionamento> {
    return this.horariosRepository.create(organizationId, createHorarioDto);
  }

  /**
   * Listar horários da organização
   * ✅ Filtra por organizationId
   */
  async findAll(organizationId: string): Promise<horarios_funcionamento[]> {
    return this.horariosRepository.findAll(organizationId);
  }

  /**
   * Buscar horários de um funcionário específico
   */
  async findByFuncionario(
    organizationId: string,
    funcionarioId: string,
  ): Promise<horarios_funcionamento[]> {
    return this.horariosRepository.findByFuncionario(organizationId, funcionarioId);
  }

  /**
   * Buscar horário por ID
   * ✅ Valida isolamento
   */
  async findOne(organizationId: string, id: string): Promise<horarios_funcionamento> {
    const horario = await this.horariosRepository.findOne(organizationId, id);

    if (!horario) {
      throw new NotFoundException('Horário não encontrado');
    }

    if (horario.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este horário',
      );
    }

    return horario;
  }

  /**
   * Atualizar horário
   * ✅ Valida isolamento
   */
  async update(
    organizationId: string,
    id: string,
    updateHorarioDto: UpdateHorarioDto,
  ): Promise<horarios_funcionamento> {
    // Validar isolamento
    await this.findOne(organizationId, id);

    return this.horariosRepository.update(organizationId, id, updateHorarioDto);
  }

  /**
   * Deactivate horário
   */
  async remove(organizationId: string, id: string): Promise<horarios_funcionamento> {
    await this.findOne(organizationId, id);

    return this.horariosRepository.delete(organizationId, id);
  }

  /**
   * Contar horários cadastrados
   */
  async count(organizationId: string): Promise<number> {
    return this.horariosRepository.count(organizationId);
  }
}
