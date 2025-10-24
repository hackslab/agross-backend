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
  Query,
  ParseBoolPipe,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateFileOrderDto } from "./dto/update-file-order.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import type { Request } from "express";
import { AuthenticatedAdmin } from "../admin/types/auth.types";

@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: "Create new product (without files)" })
  @ApiResponse({
    status: 201,
    description:
      "Product created successfully. Use separate endpoint to add files.",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(
      createProductDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Returns all products with related data",
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({
    status: 200,
    description: "Returns product details (increments view count)",
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: "Update product" })
  @ApiResponse({ status: 200, description: "Product updated successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request
  ) {
    return this.productService.update(
      id,
      updateProductDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Delete product (soft delete)" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.productService.remove(id, req.user as AuthenticatedAdmin);
  }

  // Nested routes for product files
  @ApiOperation({ summary: "Add file/image to product" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiQuery({
    name: "isVideo",
    type: Boolean,
    description: "Whether the file is a video",
    example: false,
  })
  @ApiResponse({ status: 201, description: "File added successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post(":id/files")
  @UseInterceptors(FileInterceptor("file"))
  addFile(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query("isVideo", ParseBoolPipe) isVideo: boolean,
    @Req() req: Request
  ) {
    return this.productService.addFile(
      id,
      file,
      isVideo,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Remove file from product" })
  @ApiResponse({
    status: 200,
    description: "File removed and order re-sequenced successfully",
  })
  @ApiResponse({ status: 404, description: "Product or file not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":productId/files/:fileId")
  removeFile(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Param("fileId", ParseUUIDPipe) fileId: string,
    @Req() req: Request
  ) {
    return this.productService.removeFile(
      productId,
      fileId,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Update file display order" })
  @ApiResponse({ status: 200, description: "File order updated successfully" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":productId/files/order")
  updateFileOrder(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Body() updateFileOrderDto: UpdateFileOrderDto,
    @Req() req: Request
  ) {
    return this.productService.updateFileOrder(
      productId,
      updateFileOrderDto,
      req.user as AuthenticatedAdmin
    );
  }
}
