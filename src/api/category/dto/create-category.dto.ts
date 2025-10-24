import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// Note: The 'image' property is handled via multipart/form-data in the controller
// and should not be added to this DTO.
export class CreateCategoryDto {
  @ApiProperty({
    description: "Category name in Russian",
    example: "Зерновые культуры",
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({
    description: "Category name in English",
    example: "Grain Crops",
  })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    description: "Category name in Uzbek",
    example: "Don ekinlari",
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    description: "category name in kazakh",
    example: "дәнді дақылдар",
  })
  @IsString()
  @IsNotEmpty()
  name_kz: string;

  @ApiProperty({
    description: "Category description in Russian",
    example: "Описание зерновых культур",
  })
  @IsString()
  @IsNotEmpty()
  description_ru: string;

  @ApiProperty({
    description: "Category description in English",
    example: "Grain crops description",
  })
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @ApiProperty({
    description: "Category description in Uzbek",
    example: "Don ekinlari tavsifi",
  })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiProperty({
    description: "category description in kazakh",
    example: "дәнді дақылдар сипаттамасы",
  })
  @IsString()
  @IsNotEmpty()
  description_kz: string;
}
