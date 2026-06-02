import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OrganizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Verificar se user existe (JWT já validou)
    if (!request.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const user = request.user as any;
    const organizationId = request.params.organizationId || request.body?.organizationId;

    // Se há organizationId na rota/body, validar se é do usuário
    if (organizationId && user.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Acesso negado: você não tem permissão para acessar esta organização',
      );
    }

    // Anexar organizationId ao request para uso posterior
    (request as any).organizationId = user.organizationId;

    return true;
  }
}
