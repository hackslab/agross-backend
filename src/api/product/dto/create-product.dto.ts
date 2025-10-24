import { IsNotEmpty, IsString, IsNumber, IsInt, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

// Note: Product files (images/videos) are handled via a separate multipart/form-data endpoint
// (`POST /products/:id/files`) and should not be added to this DTO.
export class CreateProductDto {
  @ApiProperty({
    description: "Product name in Russian",
    example: "Пшеница озимая",
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({
    description: "Product name in English",
    example: "Winter Wheat",
  })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    description: "Product name in Uzbek",
    example: "Qishki bugdoy",
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    description: "product name in kazakh",
    example: "қысқы бидай",
  })
  @IsString()
  @IsNotEmpty()
  name_kz: string;

  @ApiProperty({
    description: "Product description in Russian",
    example: "Высококачественная озимая пшеница",
  })
  @IsString()
  @IsNotEmpty()
  description_ru: string;

  @ApiProperty({
    description: "Product description in English",
    example: "High quality winter wheat",
  })
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @ApiProperty({
    description: "Product description in Uzbek",
    example: "Yuqori sifatli qishki bugdoy",
  })
  @IsString()
  @IsNotEmpty()
  description_uz: string;

  @ApiProperty({
    description: "product description in kazakh",
    example: "жоғары сапалы қысқы бидай",
  })
  @IsString()
  @IsNotEmpty()
  description_kz: string;

  @ApiProperty({ description: "Product price", example: 15000.0 })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: "Product structure/composition in Russian",
    example: "Белок 12%, клейковина 25%",
  })
  @IsString()
  @IsNotEmpty()
  structure_ru: string;

  @ApiProperty({
    description: "Product structure/composition in English",
    example: "Protein 12%, gluten 25%",
  })
  @IsString()
  @IsNotEmpty()
  structure_en: string;

  @ApiProperty({
    description: "Product structure/composition in Uzbek",
    example: "Oqsil 12%, gluten 25%",
  })
  @IsString()
  @IsNotEmpty()
  structure_uz: string;

  @ApiProperty({
    description: "product structure/composition in kazakh",
    example: "ақуыз 12%, глютен 25%",
  })
  @IsString()
  @IsNotEmpty()
  structure_kz: string;

  @ApiProperty({ description: "Available quantity", example: 1000 })
  @IsInt()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: "Unit of measurement ID",
    example: "uuid-of-unit",
  })
  @IsUUID()
  @IsNotEmpty()
  unitId: string;

  @ApiProperty({
    description: "Category ID",
    example: "1eb78aa7-1ff3-4f96-ab9b-3d0b745497a2",
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: "Subcategory ID",
    example: "4e84cb84-8cb8-4ab1-9ab8-c1eb4e5ac502",
  })
  @IsUUID()
  @IsNotEmpty()
  subcategoryId: string;

  @ApiProperty({
    description: "Country of origin ID",
    example: "0fcc0d2f-e72b-450b-a181-f2dfe1347205",
  })
  @IsUUID()
  @IsNotEmpty()
  countryId: string;
}
