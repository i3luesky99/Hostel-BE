import { AppRole } from '../../entities/enums';

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: AppRole[];
}
