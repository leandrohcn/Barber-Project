import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';

// Controllers


// Repositories
import { CatalogRepository } from './repository/catalog.repository';

import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogController],
  providers: [
    CatalogService,
    CatalogRepository,
    {
      provide: 'ICatalogRepository',
      useClass: CatalogRepository,
    },
  ],
})
export class CatalogModule {}
