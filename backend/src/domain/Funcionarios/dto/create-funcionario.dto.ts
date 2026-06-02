import { IsString, IsNotEmpty, IsPhoneNumber, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
