import { Admin } from "@prisma/client";

export class AdminEntity {
  id: string;
  name: string;
  username: string;
  isSuperadmin: boolean;

  constructor(partial: Partial<Admin>) {
    this.id = partial.id as string;
    this.name = partial.name as string;
    this.username = partial.username as string;
    this.isSuperadmin = partial.isSuperadmin as boolean;
  }
}
