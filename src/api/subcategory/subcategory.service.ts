import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { LogService } from "../log/log.service";

@Injectable()
export class SubcategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService
  ) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
    admin: { id: string }
  ) {
    const createdSubcategory = await this.prisma.subcategory.create({
      data: createSubcategoryDto,
    });
    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "SUBCATEGORY" as any,
      null,
      createdSubcategory
    );
    return createdSubcategory;
  }

  findAll() {
    return this.prisma.subcategory.findMany({ include: { category: true } });
  }

  async findOne(id: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }
    return subcategory;
  }

  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
    admin: { id: string }
  ) {
    const oldData = await this.findOne(id);
    const updatedSubcategory = await this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "SUBCATEGORY" as any,
      oldData,
      updatedSubcategory
    );
    return updatedSubcategory;
  }

  async remove(id: string, admin: { id: string }) {
    const oldData = await this.findOne(id);
    const deletedSubcategory = await this.prisma.subcategory.delete({
      where: { id },
    });
    await this.logService.createLog(
      admin.id,
      "DELETE" as any,
      "SUBCATEGORY" as any,
      oldData,
      deletedSubcategory
    );
    return deletedSubcategory;
  }
}
