export interface AdminJwtPayload {
  id: string;
  name: string;
  username: string;
  isSuperadmin: boolean;
}

export type AuthenticatedAdmin = AdminJwtPayload;
