import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from 'src/common';
import { GetUserId } from 'src/common/decorators/user.decorator';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { CompleteProfileDto } from './dto/complete-profile.dto';

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  /**
   * POST /staff/me/complete-profile
   * Completa o perfil do staff (cria funcionário associado)
   */
  @Post('me/complete-profile')
  async completeProfile(
    @GetUserId() userId: string,
    @GetOrganizationId() organizationId: string,
    @Body() completeProfileDto: CompleteProfileDto,
  ) {
    return this.staffService.completeProfile(
      userId,
      organizationId,
      completeProfileDto,
    );
  }

  /**
   * GET /staff/me/agendamentos
   * Retorna todos os agendamentos do staff logado
   */
  @Get('me/agendamentos')
  async getMyAgendamentos(
    @GetUserId() userId: string,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.staffService.getStaffAgendamentos(userId, organizationId);
  }

  /**
   * GET /staff/me/dashboard
   * Retorna métricas do staff logado (faturamento, clientes, agendamentos)
   */
  @Get('me/dashboard')
  async getMyDashboard(
    @GetUserId() userId: string,
    @GetOrganizationId() organizationId: string,
  ) {
    return this.staffService.getStaffDashboard(userId, organizationId);
  }
}
