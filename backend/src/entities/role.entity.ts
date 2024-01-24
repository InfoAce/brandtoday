import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity, UserEntity } from './index';
import { Seed, SeederContext, SeedEnum, SeedRelation} from 'nestjs-class-seeder';
import { Faker } from "@faker-js/faker";
import { get, keys } from 'lodash';
@Entity("roles")
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @SeedRelation(() => CompanyEntity)
  @ManyToOne(() => CompanyEntity, (company) => company.roles)
  @JoinColumn({
    name:                 "company_id",
    referencedColumnName: "id",
  })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @Seed((faker: Faker, ctx: SeederContext) => {
    const { name } = ctx.previousRecord;
    switch(name){
      case 'Test Company':
        return 'admin';
      case 'admin':
        return 'client';
      case 'client':
        return 'staff';
      case 'staff':
        return 'super';
    }
  })
  @Column({
    unique: true
  })
  name: string;

  @Seed((faker: Faker, ctx: SeederContext) => {
    const { name } = ctx.previousRecord;
    switch(name){
      case 'Test Company':
        return 2;
      case 'admin':
        return 0;
      case 'client':
        return 1;
      case 'staff':
        return 3;
    }
  })
  @Column({
    nullable: false,
  })
  state: number;

  @OneToMany(() => UserEntity, (user) => user.role )
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "role_id",
  })
  users: UserEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}