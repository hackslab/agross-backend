import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminModule } from "./api/admin/admin.module";
import { CategoryModule } from "./api/category/category.module";
import { SubcategoryModule } from "./api/subcategory/subcategory.module";
import { ProductModule } from "./api/product/product.module";
import { CountryModule } from "./api/country/country.module";
import { CarouselModule } from "./api/carousel/carousel.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UnitModule } from "./api/unit/unit.module";
import { FileUploadModule } from "./common/file-upload/file-upload.module";
import { LogModule } from "./api/log/log.module";
import { DashboardModule } from "./api/dashboard/dashboard.module";
import { CurrencyModule } from "./api/currency/currency.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FileUploadModule,
    LogModule,
    AdminModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    CountryModule,
    CarouselModule,
    UnitModule,
    DashboardModule,
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
