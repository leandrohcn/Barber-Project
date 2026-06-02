import { Injectable, Logger } from '@nestjs/common';
import { IDatabaseService } from '../database.service';

/**
 * Implementação Azure SQL Server
 * Nota: Atualmente não implementado. Usar quando migrar para Azure.
 * Será baseado em @azure/sql ou mssql package
 */
@Injectable()
export class SqlServerDatabaseService implements IDatabaseService {
  private readonly logger = new Logger(SqlServerDatabaseService.name);

  constructor() {
    this.logger.warn('SqlServerDatabaseService não está completamente implementado. Use RdsDatabaseService para AWS.');
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // TODO: Implementar com mssql package ou @azure/sql
    throw new Error('SqlServerDatabaseService não implementado para este ambiente');
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    // TODO: Implementar
    throw new Error('SqlServerDatabaseService não implementado para este ambiente');
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    // TODO: Implementar
    throw new Error('SqlServerDatabaseService não implementado para este ambiente');
  }

  async healthCheck(): Promise<boolean> {
    this.logger.warn('Health check não disponível para Azure SQL Server');
    return false;
  }

  async disconnect(): Promise<void> {
    this.logger.warn('Disconnect não disponível para Azure SQL Server');
  }
}
