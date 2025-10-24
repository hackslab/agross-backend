import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";

// Note: The 'image' property is handled via multipart/form-data in the controller
// and should not be added to this DTO.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
