export type UserRole = 'admin' | 'manager' | 'volunteer' | 'viewer';

export interface AuthUser {
  uid: string;
  orgId?: string;
  role?: UserRole;
}