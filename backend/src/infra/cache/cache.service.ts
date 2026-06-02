/**
 * Interface abstrata para cache distribuído
 * Implementações: AWS ElastiCache, Azure Redis Cache, GCP Memorystore
 *
 * Padrão TTL (em segundos):
 * - Sessions: 3600 (1 hora)
 * - User data: 1800 (30 minutos)
 * - API responses: 300 (5 minutos)
 * - Static data: 86400 (1 dia)
 */
export interface ICacheService {
  /**
   * Armazenar valor em cache
   * @param key - Chave única
   * @param value - Valor (será serializado em JSON)
   * @param ttlSeconds - Tempo de vida em segundos
   */
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;

  /**
   * Obter valor do cache
   * @param key - Chave única
   * @returns Valor desserializado ou null se não encontrado/expirado
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Deletar valor do cache
   */
  delete(key: string): Promise<void>;

  /**
   * Verificar se chave existe e não expirou
   */
  exists(key: string): Promise<boolean>;

  /**
   * Limpar todas as chaves (usar com cuidado)
   */
  flush(): Promise<void>;

  /**
   * Incrementar contador (para rate limiting)
   */
  increment(key: string, amount?: number, ttlSeconds?: number): Promise<number>;

  /**
   * Obter múltiplas chaves atomicamente
   */
  mget<T>(keys: string[]): Promise<(T | null)[]>;

  /**
   * Armazenar múltiplas chaves atomicamente
   */
  mset(entries: Record<string, any>, ttlSeconds?: number): Promise<void>;

  /**
   * Obter e deletar valor atomicamente
   */
  getAndDelete<T>(key: string): Promise<T | null>;
}
