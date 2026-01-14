import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { CatalogModule } from './domain/Catalogo/catalog.module';
import { UsersModule } from './domain/Users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, CatalogModule, UsersModule, AuthModule],
})
export class AppModule {}
