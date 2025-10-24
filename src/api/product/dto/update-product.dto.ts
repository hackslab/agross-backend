import { PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";

// Note: Product files (images/videos) are handled via a separate multipart/form-data endpoint
// (`POST /products/:id/files`) and should not be added to this DTO.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
