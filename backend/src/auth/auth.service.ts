import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import type { IAuthRepository } from './repository/auth.repository.interface';
import { AuthMapper } from './auth.mapper';
import { InvitesService } from 'src/domain/invites/invites.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository') private authRepository: IAuthRepository,
    private authMapper: AuthMapper,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private invitesService: InvitesService,
  ) {}

  /**
   * Validar credenciais e gerar token JWT
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const jwtPayload = this.authMapper.toJwtPayload(user);
    const accessToken = await this.jwtService.sign(jwtPayload);

    return this.authMapper.toAuthResponse(user, accessToken);
  }

  /**
   * Registrar novo usuário e organização
   */
  async register(data: {organizationName: string;
    email: string;
    password: string;
    name: string;
  }) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('Email já está cadastrado');
    }

    // Criar organização
    const organization = await this.prisma.organizations.create({
      data: {
        name: data.organizationName,
        slug: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
        subdomain: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
      },
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.authRepository.createUser({
      organizationId: organization.id,
      email: data.email,
      password: hashedPassword,
      name: data.name,
    } as any);

    const jwtPayload = this.authMapper.toJwtPayload(user);
    const accessToken = await this.jwtService.sign(jwtPayload);

    return this.authMapper.toAuthResponse(user, accessToken);
  }

  /**
   * Registrar staff com convite
   */
  async registerWithInvite(data: {
    inviteToken: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    // Validar o convite
    const invite = await this.invitesService.validateInvite(data.inviteToken);

    // Verificar se o email já existe
    const existingUser = await this.authRepository.findUserByEmail(invite.email);
    if (existingUser) {
      throw new BadRequestException('Email já está cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário com role STAFF
    const user = await this.prisma.users.create({
      data: {
        organizationId: invite.organizationId,
        email: invite.email,
        password: hashedPassword,
        name: data.name,
        role: 'STAFF',
        isActive: true,
      },
    });

    // Criar funcionário automaticamente
    await this.prisma.funcionarios.create({
      data: {
        organizationId: invite.organizationId,
        name: data.name,
        email: invite.email,
        phone: data.phone,
        isAtivo: true,
      },
    });

    // Marcar convite como usado
    await this.invitesService.markAsUsed(data.inviteToken);

    const jwtPayload = this.authMapper.toJwtPayload(user);
    const accessToken = await this.jwtService.sign(jwtPayload);

    return this.authMapper.toAuthResponse(user, accessToken);
  }

  /**
   * Validar JWT payload (usado pelo JwtStrategy)
   */
  async validatePayload(payload: any) {
    const user = await this.authRepository.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
