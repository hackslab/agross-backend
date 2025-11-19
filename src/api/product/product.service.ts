import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateFileOrderDto } from "./dto/update-file-order.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { FileUploadService } from "../../common/file-upload/file-upload.service";
import { LogService } from "../log/log.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly logService: LogService
  ) {}

  async create(createProductDto: CreateProductDto, admin: { id: string }) {
    const { price, ...rest } = createProductDto;
    const createdProduct = await this.prisma.product.create({
      data: {
        ...rest,
        price,
        viewCount: 0,
      },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: true,
      },
    });
    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "PRODUCT" as any,
      null,
      createdProduct
    );
    return createdProduct;
  }

  findAll() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    admin: { id: string }
  ) {
    const oldData = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: true,
      },
    });
    const { price, ...rest } = updateProductDto;
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined ? { price } : {}),
      },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: true,
      },
    });
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "PRODUCT" as any,
      oldData,
      updatedProduct
    );
    return updatedProduct;
  }

  // Soft delete
  async remove(id: string, admin: { id: string }) {
    const oldData = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: true,
      },
    });
    const deletedProduct = await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
      include: {
        category: true,
        subcategory: true,
        country: true,
        unit: true,
        files: true,
      },
    });
    await this.logService.createLog(
      admin.id,
      "DELETE" as any,
      "PRODUCT" as any,
      oldData,
      deletedProduct
    );
    return deletedProduct;
  }

  async addFile(
    productId: string,
    file: Express.Multer.File,
    isVideo: boolean,
    admin: { id: string }
  ) {
    const oldData = await this.findOne(productId); // check if product exists

    const maxOrderResult = await this.prisma.productFile.aggregate({
      _max: { order: true },
      where: { productId },
    });
    const nextOrder = (maxOrderResult._max.order ?? -1) + 1;

    const fileUrl = await this.fileUploadService.uploadFile(file, "products");
    const createdFile = await this.prisma.productFile.create({
      data: {
        productId: productId,
        url: fileUrl,
        isVideo,
        order: nextOrder,
      },
    });
    const newData = await this.findOne(productId);
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "PRODUCT" as any,
      oldData,
      newData
    );
    return createdFile;
  }

  async removeFile(productId: string, fileId: string, admin: { id: string }) {
    const oldData = await this.findOne(productId);
    const fileToDelete = await this.prisma.productFile.findUnique({
      where: { id: fileId, productId: productId },
    });

    if (!fileToDelete) {
      throw new NotFoundException(
        `File with ID ${fileId} not found for product ${productId}`
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Delete the file from S3 and DB
      await this.fileUploadService.deleteFile(fileToDelete.url);
      await tx.productFile.delete({
        where: { id: fileId },
      });

      // 2. Get remaining files in order
      const remainingFiles = await tx.productFile.findMany({
        where: { productId: productId },
        orderBy: { order: "asc" },
      });

      // 3. Create update promises for re-sequencing
      const updatePromises = remainingFiles
        .map((file, index) => {
          if (file.order !== index) {
            return tx.productFile.update({
              where: { id: file.id },
              data: { order: index },
            });
          }
          return null;
        })
        .filter((p) => p !== null);

      // 4. Execute updates if any
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    });

    const newData = await this.findOne(productId);
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "PRODUCT" as any,
      oldData,
      newData
    );
    return { message: "File removed and order updated successfully." };
  }

  async updateFileOrder(
    productId: string,
    updateFileOrderDto: UpdateFileOrderDto,
    admin: { id: string }
  ) {
    const oldData = await this.findOne(productId); // For logging

    const updates = updateFileOrderDto.files.map((file) =>
      this.prisma.productFile.update({
        where: { id: file.fileId, productId: productId }, // Ensure file belongs to product
        data: { order: file.order },
      })
    );

    await this.prisma.$transaction(updates);

    const newData = await this.findOne(productId);
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "PRODUCT" as any,
      oldData,
      newData
    );

    return { message: "File order updated successfully." };
  }
}
