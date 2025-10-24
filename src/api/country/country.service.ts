import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { LogService } from "../log/log.service";

@Injectable()
export class CountryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService
  ) {}

  async create(createCountryDto: CreateCountryDto, admin: { id: string }) {
    const createdCountry = await this.prisma.country.create({
      data: createCountryDto,
    });
    await this.logService.createLog(
      admin.id,
      "CREATE" as any,
      "COUNTRY" as any,
      null,
      createdCountry
    );
    return createdCountry;
  }

  findAll() {
    return this.prisma.country.findMany();
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
    admin: { id: string }
  ) {
    const oldData = await this.findOne(id);
    const updatedCountry = await this.prisma.country.update({
      where: { id },
      data: updateCountryDto,
    });
    await this.logService.createLog(
      admin.id,
      "UPDATE" as any,
      "COUNTRY" as any,
      oldData,
      updatedCountry
    );
    return updatedCountry;
  }

  async remove(id: string, admin: { id: string }) {
    const oldData = await this.findOne(id);
    const deletedCountry = await this.prisma.country.delete({ where: { id } });

    await this.logService.createLog(
      admin.id,
      "DELETE" as any,
      "COUNTRY" as any,
      oldData,
      deletedCountry
    );

    return deletedCountry;
  }
}
