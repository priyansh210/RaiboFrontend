
// Mappers for converting between external and internal auth models
import { ExternalLoginResponse, ExternalRegisterResponse, ExternalUserResponse } from '../models/external/AuthModels';
import { User, UserProfile } from '../models/internal/User';

export class AuthMapper {
  static mapExternalLoginToUser(external: ExternalLoginResponse): User {
    const user = external.user;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || user.first_name,
      lastName: user.lastName || user.last_name,
      fullName: user.fullname || `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim(),
      phone: user.phone,
      roles: user.roles || ['buyer'],
    };
  }

  static mapExternalRegisterToUser(external: ExternalRegisterResponse): User {
    const user = external.user;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || user.first_name,
      lastName: user.lastName || user.last_name,
      fullName: user.fullname || `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim(),
      phone: user.phone,
      roles: user.roles || ['buyer'],
    };
  }

  static mapExternalUserToUser(external: ExternalUserResponse): User {
    return {
      id: external.id,
      email: external.email,
      firstName: external.firstName || external.first_name,
      lastName: external.lastName || external.last_name,
      fullName: external.fullname || `${external.firstName || external.first_name || ''} ${external.lastName || external.last_name || ''}`.trim(),
      phone: external.phone,
      roles: external.roles || ['buyer'],
      createdAt: external.created_at ? new Date(external.created_at) : undefined,
      updatedAt: external.updated_at ? new Date(external.updated_at) : undefined,
    };
  }

  static mapUserToProfile(user: User): UserProfile {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };
  }
}
