import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/domain/Users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, 
                private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException;
        }

        const passwordValida = await bcrypt.compare(password, user.password);   
        if (!passwordValida) {
            throw new UnauthorizedException;
        }
        
        const payload = { sub: user.id, email: user.email, role: user.role };
        
        return {
            access_token: await this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }
}
