import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Minha Barbearia',
    description: 'Nome da organização (2-100 caracteres)',
  })
  @IsString({ message: 'Nome da organização deve ser uma string' })
  @MinLength(2, { message: 'Nome da organização deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome da organização deve ter no máximo 100 caracteres' })
  @IsNotEmpty({ message: 'Nome da organização é obrigatório' })
  organizationName: string;

  @ApiProperty({
    example: 'joao@barber.com',
    description: 'Email válido do usuário',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'Senha123!',
    description: 'Senha com no mínimo 8 caracteres (números, maiúsculas e minúsculas)',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    { message: 'Senha deve conter letra maiúscula, minúscula e número' }
  )
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário (2-100 caracteres)',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;
}
