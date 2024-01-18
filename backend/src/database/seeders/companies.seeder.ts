import { Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { CompanyEntity } from "src/entities";
import { CompanyModel } from "src/models";

@Injectable()
export class CompaniesSeeder implements Seeder {
  constructor(private readonly company: CompanyModel) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const companies = DataFactory.createForClass(CompanyEntity).generate(1);

    // Insert into the database.
    return this.company.save(companies);
  }

  async drop(): Promise<any> {
    // return this.role.deleteMany({});
  }
}