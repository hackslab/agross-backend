import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AdminService } from "../admin.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly adminService: AdminService) {
    super({ usernameField: "username" });
  }

  async validate(username: string, pass: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    const admin = await this.adminService.validateUser(username, pass);
    if (!admin) {
      this.logger.warn(`Failed to validate user: ${username}`);
      throw new UnauthorizedException("Invalid credentials");
    }
    this.logger.debug(`Successfully validated user: ${username}`);
    return admin;
  }
}
