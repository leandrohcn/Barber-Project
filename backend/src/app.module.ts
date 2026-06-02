import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './db/prisma.module';
import { InfraModule } from './infra/infra.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './domain/Catalogo/catalog.module';
import { UsersModule } from './domain/Users/users.module';
import { AgendamentosModule } from './domain/agendamentos/agendamentos.module';
import { DashboardModule } from './domain/dashboard/dashboard.module';
import { FuncionariosModule } from './domain/Funcionarios/funcionarios.module';
import { HorariosModule } from './domain/Horarios/horarios.module';
import { NotificacoesModule } from './domain/Notificacoes/notificacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    InfraModule,
    AuthModule,
    CatalogModule,
    UsersModule,
    AgendamentosModule,
    DashboardModule,
    FuncionariosModule,
    HorariosModule,
    NotificacoesModule,
  ],
})
export class AppModule {}
