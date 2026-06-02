import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { FuncionariosRepository } from './repository/funcionarios.repository';

import { FuncionariosController } from './funcionarios.controller';
import { FuncionariosService } from './funcionarios.service';

@Module({
  imports: [PrismaModule],
  controllers: [FuncionariosController],
  providers: [
    FuncionariosService,
    FuncionariosRepository,
    {
      provide: 'IFuncionariosRepository',
      useClass: FuncionariosRepository,
    },
  ],
  exports: [FuncionariosService],
})
export class FuncionariosModule {}
