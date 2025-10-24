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
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import type { Request } from "express";
import { AuthenticatedAdmin } from "../admin/types/auth.types";

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "Create new category" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name_ru: { type: "string", example: "Зерновые культуры" },
        name_en: { type: "string", example: "Grain Crops" },
        name_uz: { type: "string", example: "Don ekinlari" },
        name_kz: { type: "string", example: "дәнді дақылдар" },
        description_ru: { type: "string", example: "Описание категории" },
        description_en: { type: "string", example: "Category description" },
        description_uz: { type: "string", example: "Kategoriya tavsifi" },
        description_kz: { type: "string", example: "категория сипаттамасы" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Category created successfully" })
  @ApiResponse({
    status: 400,
    description: "Bad request - Image file is required",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request
  ) {
    return this.categoryService.create(
      createCategoryDto,
      image,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: 200,
    description: "Returns all categories with subcategories",
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Returns category details" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: "Update category" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name_ru: { type: "string" },
        name_en: { type: "string" },
        name_uz: { type: "string" },
        name_kz: { type: "string" },
        description_ru: { type: "string" },
        description_en: { type: "string" },
        description_uz: { type: "string" },
        description_kz: { type: "string" },
        image: { type: "string", format: "binary" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Category updated successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.categoryService.update(
      id,
      updateCategoryDto,
      req.user as AuthenticatedAdmin,
      image
    );
  }

  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted successfully" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.categoryService.remove(id, req.user as AuthenticatedAdmin);
  }
}
