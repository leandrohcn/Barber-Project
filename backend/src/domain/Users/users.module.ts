import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';


// Repositories
import { UsersRepository } from './repository/users.repository';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
