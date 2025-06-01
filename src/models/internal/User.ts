
// Internal User model
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

// User role helpers
export const UserRoles = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];
