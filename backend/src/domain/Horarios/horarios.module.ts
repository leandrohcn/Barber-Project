import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { HorariosRepository } from './repository/horarios.repository';

import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';

@Module({
  imports: [PrismaModule],
  controllers: [HorariosController],
  providers: [
    HorariosService,
    HorariosRepository,
    {
      provide: 'IHorariosRepository',
      useClass: HorariosRepository,
    },
  ],
  exports: [HorariosService],
})
export class HorariosModule {}
