import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;
}
