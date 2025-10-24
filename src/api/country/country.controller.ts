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
import { CountryService } from "./country.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";
import type { Request } from "express";
import { AuthenticatedAdmin } from "../admin/types/auth.types";

@ApiTags("Countries")
@Controller("countries")
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: "Create new country" })
  @ApiResponse({ status: 201, description: "Country created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCountryDto: CreateCountryDto, @Req() req: Request) {
    return this.countryService.create(
      createCountryDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Get all countries" })
  @ApiResponse({ status: 200, description: "Returns all countries" })
  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @ApiOperation({ summary: "Get country by ID" })
  @ApiResponse({ status: 200, description: "Returns country details" })
  @ApiResponse({ status: 404, description: "Country not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.countryService.findOne(id);
  }

  @ApiOperation({ summary: "Update country" })
  @ApiResponse({ status: 200, description: "Country updated successfully" })
  @ApiResponse({ status: 404, description: "Country not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @Req() req: Request
  ) {
    return this.countryService.update(
      id,
      updateCountryDto,
      req.user as AuthenticatedAdmin
    );
  }

  @ApiOperation({ summary: "Delete country" })
  @ApiResponse({ status: 200, description: "Country deleted successfully" })
  @ApiResponse({ status: 404, description: "Country not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.countryService.remove(id, req.user as AuthenticatedAdmin);
  }
}
