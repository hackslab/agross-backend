class DashboardStatsDto {
  totalProducts: number;
  totalCategories: number;
  totalViews: number;
  lowStockProducts: number;
}

export class DashboardSummaryDto {
  stats: DashboardStatsDto;
  activities: any[]; // Initially empty
}
