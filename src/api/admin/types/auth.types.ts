export interface AdminJwtPayload {
  id: string;
  name: string;
  username: string;
  isSuperadmin: boolean;
}

export interface AuthenticatedAdmin extends AdminJwtPayload {}
