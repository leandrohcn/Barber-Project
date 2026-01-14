import { Injectable } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    const { date, catalogoId, phone, cliente } = data;
    return this.prisma.agendamentos.create({
      data: {
        date: new Date(data.date), 
        catalogoId: Number(catalogoId),
        phone,
        cliente
      }
    })
  }

  findAll() {
    return this.prisma.agendamentos.findMany({
      include:{
        catalogo:true,
      },
      orderBy:{
        date:'desc',
      }
    });
  }

}
