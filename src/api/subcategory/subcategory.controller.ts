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
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SubcategoryService } from "./subcategory.service";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import type { Request } from "express";
import { AuthenticatedAdmin } from "../admin/types/auth.types";

@ApiTags("Subcategories")
@Controller("subcategories")
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @ApiOperation({ summary: "Create new subcategory" })
  @ApiResponse({ status: 201, description: "Subcategory created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
    @Req() req: Request
  ) {
    return this.subcategoryService.create(
      createSubcategoryDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Get all subcategories" })
  @ApiResponse({ status: 200, description: "Returns all subcategories with categories" })
  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @ApiOperation({ summary: "Get subcategory by ID" })
  @ApiResponse({ status: 200, description: "Returns subcategory details" })
  @ApiResponse({ status: 404, description: "Subcategory not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.subcategoryService.findOne(id);
  }

  @ApiOperation({ summary: "Update subcategory" })
  @ApiResponse({ status: 200, description: "Subcategory updated successfully" })
  @ApiResponse({ status: 404, description: "Subcategory not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
    @Req() req: Request
  ) {
    return this.subcategoryService.update(
      id,
      updateSubcategoryDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Delete subcategory" })
  @ApiResponse({ status: 200, description: "Subcategory deleted successfully" })
  @ApiResponse({ status: 404, description: "Subcategory not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.subcategoryService.remove(id, req.user as AuthenticatedAdmin);
  }
}
