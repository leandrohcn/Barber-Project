import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @ApiProperty({
    example: 'Corte de Cabelo',
    description: 'Nome do serviço'
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    example: 'Corte de cabelo profissional para homens',
    description: 'Descrição do serviço',
    required: false
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 50.00,
    description: 'Preço do serviço'
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Preço deve ser um número válido' })
  @Min(0.01, { message: 'Preço deve ser maior que 0' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @ApiProperty({
    example: 30,
    description: 'Duração em minutos'
  })
  @IsNumber({}, { message: 'Duração deve ser um número' })
  @Min(5, { message: 'Duração mínima é 5 minutos' })
  @Max(480, { message: 'Duração máxima é 480 minutos (8 horas)' })
  @IsNotEmpty({ message: 'Duração é obrigatória' })
  duration: number;
}
