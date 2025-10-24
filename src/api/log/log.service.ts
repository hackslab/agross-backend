import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

type ActionType = "CREATE" | "UPDATE" | "DELETE";
type EntityType =
  | "ADMIN"
  | "CAROUSEEL"
  | "CATEGORY"
  | "COUNTRY"
  | "PRODUCT"
  | "SUBCATEGORY"
  | "CAROUSEL";

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(
    adminId: string,
    actionType: ActionType,
    entityType: EntityType,
    oldData: any,
    newData: any
  ): Promise<void> {
    const sanitizedOldData = this.sanitize(oldData);
    const sanitizedNewData = this.sanitize(newData);

    try {
      await (this.prisma as any).log.create({
        data: {
          adminId,
          actionType,
          entityType,
          oldData: sanitizedOldData ? JSON.stringify(sanitizedOldData) : null,
          newData: sanitizedNewData ? JSON.stringify(sanitizedNewData) : null,
        },
      });

      // Oxirgi 250 ta logni saqlash, qolganlarini o'chirish
      await this.cleanupOldLogs();
    } catch (error) {
      // Fail-soft: do not block the main operation if logging fails (e.g., table missing)
      // Intentionally swallow after minimal visibility to avoid noisy logs in production
      // eslint-disable-next-line no-console
      console.warn(
        "LogService.createLog failed, continuing without logging:",
        error?.code || error?.message || error
      );
    }
  }

  /**
   * Faqat oxirgi 250 ta logni saqlaydi, qolganlarini o'chiradi
   */
  private async cleanupOldLogs(): Promise<void> {
    try {
      // Jami loglar sonini tekshirish
      const totalLogs = await this.prisma.log.count();

      // Agar 250 dan ko'p bo'lsa, eski loglarni o'chirish
      if (totalLogs > 200) {
        // Oxirgi 250 ta log IDlarini olish
        const logsToKeep = await this.prisma.log.findMany({
          select: { id: true },
          orderBy: { createdAt: "desc" },
          take: 250,
        });

        const idsToKeep = logsToKeep.map((log) => log.id);

        // Qolgan loglarni o'chirish
        await this.prisma.log.deleteMany({
          where: {
            id: {
              notIn: idsToKeep,
            },
          },
        });
      }
    } catch (error) {
      // Fail-soft: cleanup xatosi asosiy operatsiyani to'xtatmasligi kerak
      // eslint-disable-next-line no-console
      console.warn(
        "LogService.cleanupOldLogs failed:",
        error?.code || error?.message || error
      );
    }
  }

  private sanitize(data: any): any {
    if (!data) return null;
    const obj = { ...data };
    if (obj.password) {
      obj.password = "[REDACTED]";
    }
    return obj;
  }

  async getLogs() {
    return this.prisma.log.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            username: true,
            isSuperadmin: true,
          },
        },
      },
    });
  }
}
