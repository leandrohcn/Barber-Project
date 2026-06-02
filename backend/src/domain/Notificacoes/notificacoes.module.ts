import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { NotificacoesRepository } from './repository/notificacoes.repository';

import { NotificacoesController } from './notificacoes.controller';
import { NotificacoesService } from './notificacoes.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificacoesController],
  providers: [
    NotificacoesService,
    NotificacoesRepository,
    {
      provide: 'INotificacoesRepository',
      useClass: NotificacoesRepository,
    },
  ],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
