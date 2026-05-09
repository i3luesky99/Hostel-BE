import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { AppRole, UserStatus } from '../../../entities/enums';
import { resolveJwtSecret } from '../jwt-secret.util';

export type JwtAccessPayload = { sub: string; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret(config),
    });
  }

  async validate(payload: JwtAccessPayload) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: ['userRoles'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }
    const roles = (user.userRoles?.map((ur) => ur.role as AppRole) ??
      []) as AppRole[];
    return { id: user.id, email: user.email, roles };
  }
}
