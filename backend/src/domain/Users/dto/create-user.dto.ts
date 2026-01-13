import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @MinLength(6)
    password: string;
    @IsEnum(Role, { message: 'role must be either USER or ADMIN' })
    role: Role;
    @IsString()
    @IsNotEmpty()
    phone: string;

}
