import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class SuperadminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { isSuperadmin?: boolean } | undefined;
    return Boolean(user?.isSuperadmin);
  }
}
