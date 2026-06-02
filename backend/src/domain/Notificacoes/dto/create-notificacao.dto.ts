import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TipoNotificacao } from '@prisma/client';

export class CreateNotificacaoDto {
  @IsString()
  @IsNotEmpty()
  agendamentoId: string;

  @IsEnum(TipoNotificacao, { message: 'tipo deve ser EMAIL, SMS ou WHATSAPP' })
  @IsNotEmpty()
  tipo: TipoNotificacao;

  @IsString()
  @IsNotEmpty()
  mensagem: string;

  @IsString()
  @IsNotEmpty()
  destinatario: string; // email ou telefone para onde enviar
}
