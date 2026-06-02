import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificacoesService } from './notificacoes.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';

import { OrganizationGuard } from 'src/common/guards/organization.guard';
import { GetOrganizationId } from 'src/common/decorators/organization.decorator';
import { JwtAuthGuard } from 'src/common';

@ApiTags('Notificacoes')
@ApiBearerAuth()
@Controller('notificacoes')
@UseGuards(JwtAuthGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  /**
   * POST /notificacoes
   * Criar nova notificação
   */
  @Post()
  create(
    @GetOrganizationId() organizationId: string,
    @Body() createNotificacaoDto: CreateNotificacaoDto,
  ) {
    return this.notificacoesService.create(organizationId, createNotificacaoDto);
  }

  /**
   * GET /notificacoes
   * Listar todas as notificações da organização
   */
  @Get()
  findAll(@GetOrganizationId() organizationId: string) {
    return this.notificacoesService.findAll(organizationId);
  }

  /**
   * GET /notificacoes/nao-lidas
   * Listar apenas notificações não lidas
   */
  @Get('nao-lidas/lista')
  findUnread(@GetOrganizationId() organizationId: string) {
    return this.notificacoesService.findUnread(organizationId);
  }

  /**
   * GET /notificacoes/contagem-nao-lidas
   * Contar notificações não lidas
   */
  @Get('contagem-nao-lidas/total')
  countUnread(@GetOrganizationId() organizationId: string) {
    return this.notificacoesService.countUnread(organizationId);
  }

  /**
   * GET /notificacoes/:id
   * Buscar notificação por ID
   */
  @Get(':id')
  @UseGuards(OrganizationGuard)
  findOne(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.notificacoesService.findOne(organizationId, id);
  }

  /**
   * POST /notificacoes/:id/marcar-lida
   * Marcar notificação como lida
   */
  @Post(':id/marcar-lida')
  @UseGuards(OrganizationGuard)
  markAsRead(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.notificacoesService.markAsRead(organizationId, id);
  }

  /**
   * POST /notificacoes/marcar-todas-lidas
   * Marcar todas as notificações como lidas
   */
  @Post('marcar-todas-lidas/bulk')
  markAllAsRead(@GetOrganizationId() organizationId: string) {
    return this.notificacoesService.markAllAsRead(organizationId);
  }

  /**
   * DELETE /notificacoes/:id
   * Deletar notificação (soft delete)
   */
  @Delete(':id')
  @UseGuards(OrganizationGuard)
  remove(
    @GetOrganizationId() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.notificacoesService.remove(organizationId, id);
  }
}
