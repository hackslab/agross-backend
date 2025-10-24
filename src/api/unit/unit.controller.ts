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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UnitService } from "./unit.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard";

@ApiTags("Units")
@Controller("units")
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @ApiOperation({ summary: "Create new unit of measurement" })
  @ApiResponse({ status: 201, description: "Unit created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @ApiOperation({ summary: "Get all units" })
  @ApiResponse({ status: 200, description: "Returns all units of measurement" })
  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @ApiOperation({ summary: "Get unit by ID" })
  @ApiResponse({ status: 200, description: "Returns unit details" })
  @ApiResponse({ status: 404, description: "Unit not found" })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.unitService.findOne(id);
  }

  @ApiOperation({ summary: "Update unit" })
  @ApiResponse({ status: 200, description: "Unit updated successfully" })
  @ApiResponse({ status: 404, description: "Unit not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto
  ) {
    return this.unitService.update(id, updateUnitDto);
  }

  @ApiOperation({ summary: "Delete unit" })
  @ApiResponse({ status: 200, description: "Unit deleted successfully" })
  @ApiResponse({ status: 404, description: "Unit not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.unitService.remove(id);
  }
}
