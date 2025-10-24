import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DashboardSummaryDto } from "./dto/dashboard-summary.dto";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const [
      totalProducts,
      totalCategories,
      totalViewsAggregation,
      lowStockProducts,
    ] = await this.prisma.$transaction([
      this.prisma.product.count({ where: { isDeleted: false } }),
      this.prisma.category.count(),
      this.prisma.product.aggregate({
        _sum: { viewCount: true },
        where: { isDeleted: false },
      }),
      this.prisma.product.count({
        where: { quantity: { lt: 10 }, isDeleted: false },
      }),
    ]);

    const totalViews = totalViewsAggregation._sum.viewCount ?? 0;

    return {
      stats: {
        totalProducts,
        totalCategories,
        totalViews,
        lowStockProducts,
      },
      activities: [], // Placeholder for future implementation
    };
  }
}
