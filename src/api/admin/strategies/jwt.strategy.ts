import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AdminJwtPayload, AuthenticatedAdmin } from "../types/auth.types";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: AdminJwtPayload): Promise<AuthenticatedAdmin> {
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.id },
    });

    if (!admin) {
      throw new UnauthorizedException("Admin not found or deleted");
    }

    return {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      isSuperadmin: admin.isSuperadmin,
    };
  }
}
