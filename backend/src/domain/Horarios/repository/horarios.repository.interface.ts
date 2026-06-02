import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

export interface IHorariosRepository {
  create(organizationId: string, data: CreateHorarioDto): Promise<any>;
  findAll(organizationId: string): Promise<any[]>;
  findByFuncionario(organizationId: string, funcionarioId: string): Promise<any[]>;
  findOne(organizationId: string, id: string): Promise<any | null>;
  update(organizationId: string, id: string, data: UpdateHorarioDto): Promise<any>;
  delete(organizationId: string, id: string): Promise<any>;
  count(organizationId: string): Promise<number>;
}
