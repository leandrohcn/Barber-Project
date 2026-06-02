import { IsString, IsOptional, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9]+$/, {
    message: 'Subdomain deve conter apenas letras minúsculas e números',
  })
  subdomain: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'primaryColor deve ser uma cor hex válida (#000000)',
  })
  primaryColor?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'secondaryColor deve ser uma cor hex válida (#FFFFFF)',
  })
  secondaryColor?: string;

  @IsOptional()
  settings?: Record<string, any>;
}
