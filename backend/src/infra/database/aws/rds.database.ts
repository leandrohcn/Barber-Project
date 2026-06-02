import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { IDatabaseService } from '../database.service';

/**
 * Implementação AWS RDS com Prisma ORM
 */
@Injectable()
export class RdsDatabaseService implements IDatabaseService {
  private readonly logger = new Logger(RdsDatabaseService.name);

  constructor(private prisma: PrismaService) {}

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    try {
      this.logger.debug(`Executando query: ${sql}`);
      return await this.prisma.$queryRawUnsafe(sql, ...(params || []));
    } catch (error) {
      this.logger.error(`Erro ao executar query: ${error.message}`);
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    try {
      this.logger.debug(`Executando comando: ${sql}`);
      await this.prisma.$executeRawUnsafe(sql, ...(params || []));
    } catch (error) {
      this.logger.error(`Erro ao executar comando: ${error.message}`);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      this.logger.debug('Iniciando transação');
      return await this.prisma.$transaction(async () => {
        return await callback();
      });
    } catch (error) {
      this.logger.error(`Erro em transação: ${error.message}`);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log('Health check AWS RDS: OK');
      return true;
    } catch (error) {
      this.logger.error(`Health check AWS RDS falhou: ${error.message}`);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.log('Desconectado do AWS RDS');
    } catch (error) {
      this.logger.error(`Erro ao desconectar: ${error.message}`);
    }
  }
}
