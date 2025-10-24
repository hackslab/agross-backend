import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SuperadminGuard } from "./guards/superadmin.guard";
import { Public } from "../../common/decorators/public.decorator";
import { AdminEntity } from "./entities/admin.entity";
import type { Request } from "express";
import { AuthenticatedAdmin } from "./types/auth.types";
import { LogService } from "../log/log.service";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly logService: LogService
  ) {}

  @ApiOperation({ summary: "Create new admin (Superadmin only)" })
  @ApiResponse({ status: 201, description: "Admin created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Superadmin access required" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Post()
  create(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request
  ): Promise<AdminEntity> {
    return this.adminService.create(
      createAdminDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Get all admins (Superadmin only)" })
  @ApiResponse({ status: 200, description: "Returns all admins" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Get()
  findAll(): Promise<AdminEntity[]> {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: "Get all logs (Superadmin only)" })
  @ApiResponse({ status: 200, description: "Returns all system logs" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Get("logs")
  getLogs(): Promise<any> {
    return this.logService.getLogs();
  }

  @ApiOperation({ summary: "Get admin by ID (Superadmin only)" })
  @ApiResponse({ status: 200, description: "Returns admin details" })
  @ApiResponse({ status: 404, description: "Admin not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string): Promise<AdminEntity> {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: "Update admin (Superadmin only)" })
  @ApiResponse({ status: 200, description: "Admin updated successfully" })
  @ApiResponse({ status: 404, description: "Admin not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: Request
  ): Promise<AdminEntity> {
    return this.adminService.update(
      id,
      updateAdminDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Change password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Invalid password or missing parameters" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request
  ) {
    return this.adminService.changePassword(changePasswordDto, req.user as any);
  }

  @ApiOperation({ summary: "Delete admin (Superadmin only)" })
  @ApiResponse({ status: 200, description: "Admin deleted successfully" })
  @ApiResponse({ status: 404, description: "Admin not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, SuperadminGuard)
  @Delete(":id")
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: Request
  ): Promise<AdminEntity> {
    return this.adminService.remove(id, req.user as AuthenticatedAdmin);
  }

  @ApiOperation({ summary: "Admin login" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        username: { type: "string", example: "superadmin" },
        password: { type: "string", example: "admin123" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Login successful, returns JWT token" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req: Request) {
    return this.adminService.login(req.user as AuthenticatedAdmin);
  }
}
