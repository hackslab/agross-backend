import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { CarouselService } from "./carousel.service";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import type { Request } from "express";
import { AuthenticatedAdmin } from "../admin/types/auth.types";

@ApiTags("Carousel")
@Controller("carousel")
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @ApiOperation({ summary: "Create new carousel item" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Carousel item created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.carouselService.create(file, req.user as AuthenticatedAdmin);
  }

  @ApiOperation({ summary: "Get all carousel items" })
  @ApiResponse({ status: 200, description: "Returns all carousel items" })
  @Get()
  findAll() {
    return this.carouselService.findAll();
  }

  @ApiOperation({ summary: "Get carousel item by ID" })
  @ApiResponse({ status: 200, description: "Returns carousel item details" })
  @ApiResponse({ status: 404, description: "Carousel item not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.carouselService.findOne(id);
  }

  @ApiOperation({ summary: "Delete carousel item" })
  @ApiResponse({ status: 200, description: "Carousel item deleted successfully" })
  @ApiResponse({ status: 404, description: "Carousel item not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.carouselService.remove(id, req.user as AuthenticatedAdmin);
  }
}
