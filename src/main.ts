import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: "100mb" }));
  app.use(urlencoded({ extended: true, limit: "100mb" }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Agross API")
    .setDescription("The Agross API documentation - Agricultural Products Management System")
    .setVersion("1.0")
    .addTag("Admin", "Admin authentication and management")
    .addTag("Carousel", "Carousel/Banner management")
    .addTag("Categories", "Product categories")
    .addTag("Subcategories", "Product subcategories")
    .addTag("Products", "Product management")
    .addTag("Countries", "Country management")
    .addTag("Units", "Unit of measurement management")
    .addTag("Currency", "Currency management")
    .addTag("Dashboard", "Dashboard statistics")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api`);
  });
}
bootstrap();
