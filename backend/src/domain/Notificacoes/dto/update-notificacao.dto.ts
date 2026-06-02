import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificacaoDto {
  @IsBoolean()
  @IsOptional()
  read?: boolean;
}
