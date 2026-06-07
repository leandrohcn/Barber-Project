import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from 'src/common';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  /**
   * POST /invites/generate
   * Gerar um convite para um funcionário (OWNER apenas)
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async generateInvite(
    @GetOrganizationId() organizationId: string,
    @Body() body: { email: string }
  ) {
    return this.invitesService.generateInvite(organizationId, body.email);
  }

  /**
   * GET /invites/validate/:token
   * Validar um convite (público)
   */
  @Get('validate/:token')
  async validateInvite(@Param('token') token: string) {
    const invite = await this.invitesService.validateInvite(token);
    return {
      valid: true,
      email: invite.email,
      organizationId: invite.organizationId,
      organizationName: invite.organizations.name,
    };
  }
}
