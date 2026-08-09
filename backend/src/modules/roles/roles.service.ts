import { ROLE_PERMISSIONS } from '../../common/permissions';
import { rolesRepository } from './roles.repository';

export class RolesService {
  async list() {
    const roles = await rolesRepository.findAll();
    return roles.map((r) => ({
      ...r,
      permissions: ROLE_PERMISSIONS[r.name] || [],
    }));
  }
}

export const rolesService = new RolesService();
