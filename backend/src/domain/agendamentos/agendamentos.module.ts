import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { AgendamentosRepository } from './repository/agendamentos.repository';

import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AgendamentosController],
  providers: [
    AgendamentosService,
    AgendamentosRepository,
    {
      provide: 'IAgendamentosRepository',
      useClass: AgendamentosRepository,
    },
  ],
})
export class AgendamentosModule {}
