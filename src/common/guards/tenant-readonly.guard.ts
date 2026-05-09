import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppRole } from '../../entities/enums';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class TenantReadOnlyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    if (req.method === 'OPTIONS') {
      return true;
    }
    const user = req.user as AuthenticatedUser | undefined;
    if (!user?.roles?.length) {
      throw new ForbiddenException('No application role assigned');
    }

    const canWrite = user.roles.some(
      (r) => r === AppRole.OWNER || r === AppRole.ADMIN,
    );
    if (canWrite) {
      return true;
    }

    const method = req.method?.toUpperCase() ?? '';
    if (method === 'GET' || method === 'HEAD') {
      return true;
    }

    throw new ForbiddenException(
      'Tenant accounts may only use read-only (GET/HEAD) APIs',
    );
  }
}
