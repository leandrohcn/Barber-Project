import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Minha Barbearia',
    description: 'Nome da organização',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    example: 'joao@barber.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Senha123',
    description: 'Senha com no mínimo 6 caracteres',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do usuário',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  name: string;
}
