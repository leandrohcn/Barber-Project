import { IsString, IsNotEmpty, IsNumber, Min, Max, Matches, IsOptional, IsBoolean } from 'class-validator';

export class CreateHorarioDto {
  @IsString()
  @IsNotEmpty()
  funcionarioId: string;

  @IsNumber()
  @Min(0)
  @Max(6)
  diaSemana: number; // 0 = Domingo, 6 = Sábado

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaInicio must be in HH:mm format',
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'horaFim must be in HH:mm format',
  })
  horaFim: string;

  @IsBoolean()
  @IsOptional()
  estaAtivo?: boolean;
}
