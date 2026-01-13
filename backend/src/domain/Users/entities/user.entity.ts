import { User as PrismaServiceType } from "@prisma/client";
import { Exclude } from "class-transformer";

export class User implements PrismaServiceType{
    id: number;
    name: string;
    email: string;
    phone: string;
    @Exclude()
    password: string;
    role: string;
    
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
