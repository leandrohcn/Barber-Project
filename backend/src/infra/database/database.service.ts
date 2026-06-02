/**
 * Interface abstrata para operações de banco de dados
 * Implementações: AWS RDS, Azure SQL Server, Google Cloud SQL
 */
export interface IDatabaseService {
  /**
   * Executar query e retornar resultados
   */
  query<T>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Executar comando (INSERT, UPDATE, DELETE)
   */
  execute(sql: string, params?: any[]): Promise<void>;

  /**
   * Executar múltiplos comandos em transação
   */
  transaction<T>(callback: () => Promise<T>): Promise<T>;

  /**
   * Verificar conexão com banco
   */
  healthCheck(): Promise<boolean>;

  /**
   * Desconectar do banco
   */
  disconnect(): Promise<void>;
}
