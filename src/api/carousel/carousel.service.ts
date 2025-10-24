import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FileUploadService } from "../../common/file-upload/file-upload.service";
import { LogService } from "../log/log.service";

@Injectable()
export class CarouselService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly logService: LogService
  ) {}

  async create(file: Express.Multer.File, admin: { id: string }) {
    const fileUrl = await this.fileUploadService.uploadFile(file, "carousel");
    const createdCarousel = await this.prisma.carousel.create({
      data: {
        file: fileUrl,
      },
    });

    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "CAROUSEL" as any,
      null,
      createdCarousel
    );

    return createdCarousel;
  }

  findAll() {
    return this.prisma.carousel.findMany();
  }

  async findOne(id: string) {
    const carouselItem = await this.prisma.carousel.findUnique({
      where: { id },
    });
    if (!carouselItem) {
      throw new NotFoundException(`Carousel item with ID ${id} not found`);
    }
    return carouselItem;
  }

  async remove(id: string, admin: { id: string }) {
    const carouselItem = await this.findOne(id);
    if (carouselItem.file) {
      await this.fileUploadService.deleteFile(carouselItem.file);
    }
    const deletedCarousel = await this.prisma.carousel.delete({
      where: { id },
    });

    await this.logService.createLog(
      admin.id,
      "DELETE" as any,
      "CAROUSEL" as any,
      carouselItem,
      deletedCarousel
    );

    return deletedCarousel;
  }
}
