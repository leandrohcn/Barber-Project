import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { infraProviders } from './providers';

// Database Providers
import { RdsDatabaseService } from './database/aws/rds.database';
import { SqlServerDatabaseService } from './database/azure/sql-server.database';

// Storage Providers
import { S3StorageService } from './storage/aws/s3.storage';
import { BlobStorageService } from './storage/azure/blob.storage';

// Email Providers
import { SesEmailService } from './email/aws/ses.email';
import { SendgridEmailService } from './email/sendgrid/sendgrid.email';

// Cache Providers
import { ElastiCacheService } from './cache/aws/elasticache.service';
import { RedisCacheService } from './cache/azure/redis-cache.service';

/**
 * Módulo de Infraestrutura Cloud-Agnostic
 *
 * Exporta:
 * - DATABASE_SERVICE (baseado em CLOUD_PROVIDER env var)
 * - STORAGE_SERVICE (baseado em CLOUD_PROVIDER env var)
 * - EMAIL_SERVICE (baseado em CLOUD_PROVIDER env var)
 * - CACHE_SERVICE (TODO)
 *
 * Uso:
 * 1. Importar InfraModule em AppModule
 * 2. Injetar os serviços nos seus controllers/services
 * 3. Trocar de cloud apenas alterando CLOUD_PROVIDER no .env
 *
 * Exemplo:
 * constructor(@Inject('DATABASE_SERVICE') private db: IDatabaseService) {}
 * constructor(@Inject('STORAGE_SERVICE') private storage: IStorageService) {}
 * constructor(@Inject('EMAIL_SERVICE') private email: IEmailService) {}
 */

@Module({
  imports: [PrismaModule],
  providers: [
    ...infraProviders,
    // Database Providers
    RdsDatabaseService,
    SqlServerDatabaseService,
    // Storage Providers
    S3StorageService,
    BlobStorageService,
    // Email Providers
    SesEmailService,
    SendgridEmailService,
    // Cache Providers
    ElastiCacheService,
    RedisCacheService,
  ],
  exports: [
    'DATABASE_SERVICE',
    'STORAGE_SERVICE',
    'EMAIL_SERVICE',
    'CACHE_SERVICE',
  ],
})
export class InfraModule {}
