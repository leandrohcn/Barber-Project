import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { DashboardRepository } from './repository/dashboard.repository';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardRepository,
    {
      provide: 'IDashboardRepository',
      useClass: DashboardRepository,
    },
  ],
})
export class DashboardModule {}
