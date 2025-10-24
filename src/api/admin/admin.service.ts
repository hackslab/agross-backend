import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AdminJwtPayload } from "./types/auth.types";
import { AdminEntity } from "./entities/admin.entity";
import { LogService } from "../log/log.service";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logService: LogService
  ) {}

  async create(
    createAdminDto: CreateAdminDto,
    admin: { id: string }
  ): Promise<AdminEntity> {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const createdAdmin = await this.prisma.admin.create({
      data: {
        ...createAdminDto,
        password: hashedPassword,
        isSuperadmin: createAdminDto.isSuperadmin ?? false,
      },
    });
    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "ADMIN" as any,
      null,
      createdAdmin
    );
    return new AdminEntity(createdAdmin);
  }

  async findAll(): Promise<AdminEntity[]> {
    const admins = await this.prisma.admin.findMany();
    return admins.map((admin) => new AdminEntity(admin));
  }

  async findOne(id: string): Promise<AdminEntity> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return new AdminEntity(admin);
  }

  async findOneByUsername(username: string) {
    return this.prisma.admin.findFirst({ where: { username } as any });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.debug(`Looking for admin with username: ${username}`);
    const admin = await this.findOneByUsername(username);

    if (!admin) {
      this.logger.warn(`Admin not found with username: ${username}`);
      return null;
    }

    this.logger.debug(`Found admin, comparing password...`);
    const isPasswordValid = await bcrypt.compare(pass, admin.password);

    if (isPasswordValid) {
      this.logger.debug(`Password valid for user: ${username}`);
      const { password, ...result } = admin;
      return result;
    }

    this.logger.warn(`Invalid password for user: ${username}`);
    return null;
  }

  async login(admin: {
    id: string;
    name: string;
    username: string;
    isSuperadmin: boolean;
  }) {
    const payload: AdminJwtPayload = {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      isSuperadmin: admin.isSuperadmin,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async countSuperadmins(): Promise<number> {
    return this.prisma.admin.count({ where: { isSuperadmin: true } as any });
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    currentUser: { id: string; isSuperadmin: boolean }
  ): Promise<AdminEntity> {
    const { newPassword, oldPassword, adminId } = changePasswordDto;

    if (currentUser.isSuperadmin && adminId) {
      // Superadmin changing another admin's password
      const adminToUpdate = await this.findOne(adminId);
      const oldData = await this.prisma.admin.findUnique({
        where: { id: adminToUpdate.id },
      });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await this.prisma.admin.update({
        where: { id: adminToUpdate.id },
        data: { password: hashedPassword },
      });
      await this.logService.createLog(
        currentUser.id,
        "UPDATE" as any,
        "ADMIN" as any,
        oldData,
        updated
      );
      return new AdminEntity(updated);
    }

    // Regular admin or superadmin changing their own password
    if (!oldPassword) {
      throw new ForbiddenException(
        "Old password is required to change your own password."
      );
    }

    const adminToUpdateRaw = await this.prisma.admin.findUnique({
      where: { id: currentUser.id },
    });
    if (!adminToUpdateRaw) {
      throw new NotFoundException(`Admin with ID ${currentUser.id} not found`);
    }
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      adminToUpdateRaw.password
    );

    if (!isPasswordValid) {
      throw new ForbiddenException("Invalid old password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await this.prisma.admin.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword },
    });
    await this.logService.createLog(
      currentUser.id,
      "UPDATE" as any,
      "ADMIN" as any,
      adminToUpdateRaw,
      updated
    );
    return new AdminEntity(updated);
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    currentUser: { id: string }
  ): Promise<AdminEntity> {
    const oldData = await this.findOne(id);
    // Prevent the last superadmin from demoting themself
    if (
      currentUser.id === id &&
      Object.prototype.hasOwnProperty.call(updateAdminDto, "isSuperadmin") &&
      (updateAdminDto as any).isSuperadmin === false
    ) {
      const superadminCount = await this.countSuperadmins();
      if (superadminCount <= 1) {
        throw new ForbiddenException("Cannot demote the last superadmin");
      }
    }

    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto as any,
    });
    await this.logService.createLog(
      currentUser.id,
      "UPDATE" as any,
      "ADMIN" as any,
      oldData,
      updatedAdmin
    );
    return new AdminEntity(updatedAdmin);
  }

  async remove(id: string, currentUser: { id: string }): Promise<AdminEntity> {
    const oldData = await this.findOne(id);
    // Prevent the last superadmin from deleting themself
    if (currentUser.id === id) {
      const superadminCount = await this.countSuperadmins();
      if (superadminCount <= 1) {
        throw new ForbiddenException("Cannot delete the last superadmin");
      }
    }

    const deletedAdmin = await this.prisma.admin.delete({ where: { id } });
    await this.logService.createLog(
      currentUser.id,
      "DELETE" as any,
      "ADMIN" as any,
      oldData,
      deletedAdmin
    );
    return new AdminEntity(deletedAdmin);
  }
}
