import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { CatalogModule } from './domain/Catalogo/catalog.module';

@Module({
  imports: [PrismaModule, CatalogModule],
})
export class AppModule {}
