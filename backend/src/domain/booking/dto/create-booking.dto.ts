import { IsString, IsEmail, IsPhoneNumber, IsUUID, IsISO8601 } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  clienteNome: string;

  @IsEmail()
  clienteEmail: string;

  @IsPhoneNumber('BR')
  clienteTelefone: string;

  @IsUUID()
  catalogoId: string;

  @IsUUID()
  funcionarioId: string;

  @IsISO8601()
  date: string; // ISO 8601 format (2024-06-10T10:00:00Z)

  @IsString()
  notas?: string;
}
