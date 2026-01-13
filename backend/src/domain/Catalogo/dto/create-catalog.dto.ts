import { IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCatalogDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    description?: string;
    @IsNotEmpty()
    @Min(0)
    price: number;
    @IsNotEmpty()
    @Min(1)
    duration: number;
}
