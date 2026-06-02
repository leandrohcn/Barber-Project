import { Provider } from '@nestjs/common';
import { RdsDatabaseService } from './database/aws/rds.database';
import { SqlServerDatabaseService } from './database/azure/sql-server.database';
import { IDatabaseService } from './database/database.service';
import { S3StorageService } from './storage/aws/s3.storage';
import { BlobStorageService } from './storage/azure/blob.storage';
import { IStorageService } from './storage/storage.service';
import { SesEmailService } from './email/aws/ses.email';
import { SendgridEmailService } from './email/sendgrid/sendgrid.email';
import { IEmailService } from './email/email.service';
import { ElastiCacheService } from './cache/aws/elasticache.service';
import { RedisCacheService } from './cache/azure/redis-cache.service';
import { ICacheService } from './cache/cache.service';

/**
 * Provider que seleciona qual implementação de cloud usar
 * Baseado na variável de ambiente CLOUD_PROVIDER
 *
 * Valores aceitos:
 * - aws (padrão)
 * - azure
 * - gcp
 */

const CLOUD_PROVIDER = process.env.CLOUD_PROVIDER?.toLowerCase() || 'aws';

console.log(`🌩️  Cloud Provider configurado: ${CLOUD_PROVIDER.toUpperCase()}`);

// ==================== DATABASE ====================
export const databaseProvider: Provider = {
  provide: 'DATABASE_SERVICE',
  useClass:
    CLOUD_PROVIDER === 'azure' ? SqlServerDatabaseService :
    CLOUD_PROVIDER === 'gcp' ? RdsDatabaseService : // TODO: Implementar GCP
    RdsDatabaseService, // default: AWS
};

// ==================== STORAGE ====================
export const storageProvider: Provider = {
  provide: 'STORAGE_SERVICE',
  useClass:
    CLOUD_PROVIDER === 'azure' ? BlobStorageService :
    CLOUD_PROVIDER === 'gcp' ? S3StorageService : // TODO: Implementar GCP CloudStorage
    S3StorageService, // default: AWS
};

// ==================== EMAIL ====================
export const emailProvider: Provider = {
  provide: 'EMAIL_SERVICE',
  useClass:
    CLOUD_PROVIDER === 'azure' ? SendgridEmailService :
    CLOUD_PROVIDER === 'gcp' ? SendgridEmailService :
    SesEmailService, // default: AWS SES
};

// ==================== CACHE ====================
export const cacheProvider: Provider = {
  provide: 'CACHE_SERVICE',
  useClass:
    CLOUD_PROVIDER === 'azure' ? RedisCacheService :
    CLOUD_PROVIDER === 'gcp' ? RedisCacheService :
    ElastiCacheService, // default: AWS ElastiCache
};

/**
 * Exportar todos os providers
 * Use isso no InfraModule
 */
export const infraProviders = [
  databaseProvider,
  storageProvider,
  emailProvider,
  cacheProvider,
];
