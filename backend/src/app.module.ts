import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { CatalogModule } from './domain/Catalogo/catalog.module';
import { UsersModule } from './domain/Users/users.module';

@Module({
  imports: [PrismaModule, CatalogModule, UsersModule],
})
export class AppModule {}
