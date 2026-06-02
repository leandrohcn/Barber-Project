import type { funcionarios as PrismaFuncionarioType } from '@prisma/client';

export class Funcionario implements PrismaFuncionarioType {
  id: string;
  organizationId: string;
  name: string;
  phone: string | null;
  email: string | null;
  dataAdmissao: Date;
  isAtivo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: PrismaFuncionarioType) {
    Object.assign(this, data);
  }
}