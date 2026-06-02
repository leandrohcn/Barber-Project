import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICacheService } from './cache.service';

/**
 * EXEMPLO DE USO DO CACHE SERVICE
 *
 * Este arquivo demonstra padrões de uso recomendados.
 * Remova este arquivo em produção.
 */

// ============================================================================
// EXEMPLO 1: Cache de Dados Estáticos (Catálogos, Configurações)
// ============================================================================

@Injectable()
export class CatalogCacheExample {
  private readonly logger = new Logger(CatalogCacheExample.name);

  constructor(
    @Inject('CACHE_SERVICE') private cache: ICacheService,
    // private catalogRepository: CatalogRepository,
  ) { }

  /**
   * Obter catálogo com cache de 5 minutos
   */
  async getCatalogWithCache(catalogId: string) {
    const cacheKey = `catalog:${catalogId}`;

    // Tentar buscar do cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug(`📦 Cache HIT para catálogo ${catalogId}`);
      return cached;
    }

    // Buscar do banco se não estiver em cache
    this.logger.debug(`📦 Cache MISS para catálogo ${catalogId}`);
    // const catalog = await this.catalogRepository.findById(catalogId);

    // Guardar em cache por 5 minutos
    // await this.cache.set(cacheKey, catalog, 300);
    // return catalog;
  }

  /**
   * Atualizar catálogo e invalidar cache
   */
  async updateCatalogAndInvalidate(catalogId: string, data: any) {
    // const updated = await this.catalogRepository.update(catalogId, data);

    // Invalidar cache quando atualizar
    await this.cache.delete(`catalog:${catalogId}`);

    // return updated;
  }

  /**
   * Listar catálogos com cache por organização
   */
  async listCatalogsWithCache(organizationId: string) {
    const cacheKey = `org:${organizationId}:catalogs`;

    // Tentar cache
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) {
      this.logger.debug(`📦 Cache HIT para catálogos da org ${organizationId}`);
      return cached;
    }

    // Buscar do banco
    // const catalogs = await this.catalogRepository.findByOrganization(organizationId);

    // Cache por 5 minutos - listagens mudam frequentemente
    // await this.cache.set(cacheKey, catalogs, 300);
    // return catalogs;
  }
}

// ============================================================================
// EXEMPLO 2: Rate Limiting com Contador
// ============================================================================

@Injectable()
export class RateLimitCacheExample {
  private readonly logger = new Logger(RateLimitCacheExample.name);

  constructor(@Inject('CACHE_SERVICE') private cache: ICacheService) { }

  /**
   * Verificar se usuario excedeu rate limit
   * Padrão: 100 requisições por hora
   */
  async checkRateLimit(userId: string, limit: number = 100): Promise<boolean> {
    const key = `ratelimit:api:${userId}`;

    // Incrementar contador (reseta a cada hora)
    const current = await this.cache.increment(key, 1, 3600);

    if (current > limit) {
      this.logger.warn(
        `⚠️  Rate limit excedido para usuario ${userId}: ${current}/${limit}`
      );
      return false;
    }

    this.logger.debug(`✅ Rate limit OK para usuario ${userId}: ${current}/${limit}`);
    return true;
  }

  /**
   * Rate limiting por IP para endpoints públicos
   */
  async checkIpRateLimit(ip: string, limit: number = 1000): Promise<boolean> {
    const key = `ratelimit:ip:${ip}`;
    const current = await this.cache.increment(key, 1, 3600);
    return current <= limit;
  }
}

// ============================================================================
// EXEMPLO 3: Sessões de Usuário
// ============================================================================

@Injectable()
export class UserSessionCacheExample {
  private readonly logger = new Logger(UserSessionCacheExample.name);

  constructor(@Inject('CACHE_SERVICE') private cache: ICacheService) { }

  /**
   * Armazenar sessão do usuário
   */
  async storeSession(userId: string, sessionData: any) {
    const key = `session:${userId}`;

    // Sessões duram 1 hora
    await this.cache.set(key, sessionData, 3600);

    this.logger.debug(`🔐 Sessão armazenada para usuario ${userId}`);
  }

  /**
   * Obter sessão do usuário
   */
  async getSession(userId: string) {
    const key = `session:${userId}`;
    const session = await this.cache.get(key);

    if (!session) {
      this.logger.warn(`⚠️  Sessão expirada para usuario ${userId}`);
    }

    return session;
  }

  /**
   * Invalidar sessão (logout)
   */
  async invalidateSession(userId: string) {
    const key = `session:${userId}`;
    await this.cache.delete(key);

    this.logger.debug(`🔐 Sessão invalidada para usuario ${userId}`);
  }
}

// ============================================================================
// EXEMPLO 4: Bulk Operations
// ============================================================================

@Injectable()
export class BulkCacheExample {
  private readonly logger = new Logger(BulkCacheExample.name);

  constructor(@Inject('CACHE_SERVICE') private cache: ICacheService) { }

  /**
   * Armazenar múltiplas entidades de uma vez
   */
  async cacheMultipleCatalogs(catalogs: Record<string, any>) {
    const entries: Record<string, any> = {};

    // Preparar entries com chaves apropriadas
    for (const [id, catalog] of Object.entries(catalogs)) {
      entries[`catalog:${id}`] = catalog;
    }

    // Armazenar todos atomicamente
    await this.cache.mset(entries, 300); // 5 minutos

    this.logger.debug(`📦 ${Object.keys(catalogs).length} catálogos em cache`);
  }

  /**
   * Obter múltiplas entidades de uma vez
   */
  async getMultipleCatalogs(catalogIds: string[]) {
    const keys = catalogIds.map((id) => `catalog:${id}`);

    // Obter todos de uma vez
    const results = await this.cache.mget<any>(keys);

    this.logger.debug(
      `📦 ${results.filter((r) => r !== null).length}/${catalogIds.length} catálogos do cache`
    );

    return results;
  }
}

// ============================================================================
// EXEMPLO 5: Atomic Operations (Transações)
// ============================================================================

@Injectable()
export class AtomicCacheExample {
  private readonly logger = new Logger(AtomicCacheExample.name);

  constructor(@Inject('CACHE_SERVICE') private cache: ICacheService) { }

  /**
   * Processar item uma única vez (evitar duplicação)
   * Padrão: obter e deletar atomicamente
   */
  async processQueueItem(queueKey: string) {
    // Obter e deletar atomicamente
    const item = await this.cache.getAndDelete<any>(queueKey);

    if (!item) {
      this.logger.warn(`⚠️  Item de fila não encontrado: ${queueKey}`);
      return null;
    }

    this.logger.debug(`✅ Item de fila removido e processado: ${queueKey}`);
    return item;
  }

  /**
   * Distributed Lock simples
   */
  async acquireLock(resourceId: string, lockDuration: number = 30) {
    const lockKey = `lock:${resourceId}`;
    const lockId = `${Date.now()}-${Math.random()}`;

    // Tentar adquirir lock
    const existing = await this.cache.get(lockKey);
    if (existing) {
      this.logger.warn(`⚠️  Recurso bloqueado: ${resourceId}`);
      return null;
    }

    // Armazenar lock
    await this.cache.set(lockKey, lockId, lockDuration);

    this.logger.debug(`🔒 Lock adquirido: ${resourceId}`);
    return lockId;
  }

  /**
   * Liberar lock
   */
  async releaseLock(resourceId: string, lockId: string) {
    const lockKey = `lock:${resourceId}`;
    const current = await this.cache.get<string>(lockKey);

    // Verificar se é o mesmo lock
    if (current !== lockId) {
      this.logger.warn(`⚠️  Lock inválido para: ${resourceId}`);
      return false;
    }

    await this.cache.delete(lockKey);
    this.logger.debug(`🔓 Lock liberado: ${resourceId}`);
    return true;
  }
}

// ============================================================================
// EXEMPLO 6: Cache com Validação de Existência
// ============================================================================

@Injectable()
export class ConditionalCacheExample {
  private readonly logger = new Logger(ConditionalCacheExample.name);

  constructor(@Inject('CACHE_SERVICE') private cache: ICacheService) { }

  /**
   * Obter dados apenas se cache existe
   */
  async getCachedIfExists(key: string) {
    const exists = await this.cache.exists(key);

    if (!exists) {
      this.logger.debug(`❌ Chave não está em cache: ${key}`);
      return null;
    }

    const data = await this.cache.get(key);
    this.logger.debug(`✅ Chave encontrada em cache: ${key}`);
    return data;
  }

  /**
   * Limpar todos os dados em caso de erro crítico
   */
  async flushCacheOnError(error: Error) {
    this.logger.error(`🔴 Erro crítico detectado, limpando cache: ${error.message}`);

    // Limpar tudo (usar com cuidado!)
    await this.cache.flush();

    this.logger.warn(`⚠️  Cache completamente limpo`);
  }
}
