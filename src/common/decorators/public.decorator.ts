import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Skip JWT; used for login, health, etc. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
