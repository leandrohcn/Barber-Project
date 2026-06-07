import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/db/prisma.module';



// Repositories
import { AuthRepository } from './repository/auth.repository';
import { AuthMapper } from './auth.mapper';

// Common (Guards & Strategies)

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtStrategy } from 'src/common';
import { InvitesModule } from 'src/domain/invites/invites.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    InvitesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthMapper,
    AuthRepository,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    JwtStrategy,
    JwtAuthGuard,
    OrganizationGuard,
  ],
  exports: [AuthService, JwtAuthGuard, OrganizationGuard, 'IAuthRepository'],
})
export class AuthModule {}
