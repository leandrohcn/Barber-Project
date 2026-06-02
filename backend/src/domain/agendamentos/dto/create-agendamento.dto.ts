import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateAgendamentoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  clienteNome: string;

  @IsEmail()
  @IsOptional()
  clienteEmail?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'clienteTelefone deve ser um telefone válido',
  })
  clienteTelefone: string;

  @IsString()
  @IsNotEmpty()
  catalogoId: string;

  @IsString()
  @IsOptional()
  funcionarioId?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notas?: string;
}
