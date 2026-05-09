import { ConfigService } from '@nestjs/config';

export function resolveJwtSecret(config: ConfigService): string {
  return (
    config.get<string>('JWT_SECRET') ??
    'hostel-dev-jwt-secret-min-32-chars-change-me'
  );
}
