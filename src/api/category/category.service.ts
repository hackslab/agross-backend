import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { FileUploadService } from "../../common/file-upload/file-upload.service";
import { LogService } from "../log/log.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly logService: LogService
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
    admin: { id: string }
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }
    const imageUrl = await this.fileUploadService.uploadFile(
      image,
      "categories"
    );
    const createdCategory = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        image: imageUrl,
      },
    });
    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "CATEGORY" as any,
      null,
      createdCategory
    );
    return createdCategory;
  }

  findAll() {
    return this.prisma.category.findMany({ include: { subcategories: true } });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true, products: true },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    admin: { id: string },
    image?: Express.Multer.File
  ) {
    let imageUrl: string | undefined;
    const oldData = await this.findOne(id);
    if (image) {
      const oldCategory = await this.findOne(id);
      if (oldCategory.image) {
        await this.fileUploadService.deleteFile(oldCategory.image);
      }
      imageUrl = await this.fileUploadService.uploadFile(image, "categories");
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        ...(imageUrl && { image: imageUrl }),
      },
    });
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "CATEGORY" as any,
      oldData,
      updatedCategory
    );
    return updatedCategory;
  }

  async remove(id: string, admin: { id: string }) {
    const category = await this.findOne(id);
    if (category.image) {
      await this.fileUploadService.deleteFile(category.image);
    }
    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });
    await this.logService.createLog(
      admin.id,
      "DELETE" as any,
      "CATEGORY" as any,
      category,
      deletedCategory
    );
    return deletedCategory;
  }
}
