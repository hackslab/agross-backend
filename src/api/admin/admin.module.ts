import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SuperadminGuard } from "./guards/superadmin.guard";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");
        if (!secret) {
          throw new Error("JWT_SECRET is not set");
        }

        const raw = configService.get<string>("JWT_EXPIRATION_TIME") ?? "1d";
        const expiresInValue = /^\d+$/.test(raw) ? Number(raw) : raw;
        const expiresIn: JwtSignOptions["expiresIn"] = expiresInValue as any;

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    SuperadminGuard,
  ],
  exports: [AdminService],
})
export class AdminModule {}
