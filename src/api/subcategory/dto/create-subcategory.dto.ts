import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSubcategoryDto {
  @ApiProperty({
    description: "Subcategory name in Russian",
    example: "Пшеница",
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ description: "Subcategory name in English", example: "Wheat" })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ description: "Subcategory name in Uzbek", example: "Bugdoy" })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ description: "subcategory name in kazakh", example: "бидай" })
  @IsString()
  @IsNotEmpty()
  name_kz: string;

  @ApiProperty({
    description: "Category ID",
    example: "1eb78aa7-1ff3-4f96-ab9b-3d0b745497a2",
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
