import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Login com email e senha' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna token JWT' })
    @ApiResponse({ status: 401, description: 'Email ou senha incorretos' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.validateUser(loginDto.email, loginDto.password);
    }

    @ApiOperation({ summary: 'Registrar novo usuário e organização' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Email já cadastrado' })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Registrar staff com convite' })
    @ApiBody({ type: Object })
    @ApiResponse({ status: 201, description: 'Staff criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Convite inválido ou expirado' })
    @HttpCode(HttpStatus.CREATED)
    @Post('register-with-invite')
    async registerWithInvite(@Body() body: { inviteToken: string; password: string; name: string }) {
        return this.authService.registerWithInvite(body);
    }
}
