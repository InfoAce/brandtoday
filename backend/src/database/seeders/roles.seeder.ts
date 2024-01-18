import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Seeder, DataFactory } from "nestjs-seeder";
import { RoleEntity, UserEntity } from "src/entities";
import { RoleModel } from "src/models";
import { UserRepository } from "src/repositories";

@Injectable()
export class RolesSeeder implements Seeder {
  constructor(@InjectEntityManager(RoleEntity.name) private readonly role: RoleModel) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const roles = DataFactory.createForClass(RoleEntity).generate(10);

    // Insert into the database.
    return this.role.save(roles);
  }

  async drop(): Promise<any> {
    // return this.role.deleteMany({});
  }
}