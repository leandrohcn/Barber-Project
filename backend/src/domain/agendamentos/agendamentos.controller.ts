import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  create(@Body() createAgendamentoDto: any) {
    return this.agendamentosService.create(createAgendamentoDto);
  }

  @Get()
  findAll() {
    return this.agendamentosService.findAll();
  }

  @Patch(':id') 
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.agendamentosService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendamentosService.remove(+id);
  }
}
