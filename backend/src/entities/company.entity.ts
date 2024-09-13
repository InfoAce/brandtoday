import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { RoleEntity, UserEntity } from './index';
import { Seed, SeedRelation } from 'nestjs-class-seeder';

@Entity("companies")
export class CompanyEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
    type: 'longtext'
  })
  about_us: string;

  @Column({
    nullable: true
  })
  address: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  banners: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  brands: string;

  @Seed('Test Company')
  @Column()
  name: string;

  @Seed('info@company.com')
  @Column({
    unique: true
  })
  email: string

  @Column({
    nullable: true,
    type: 'longtext'
  })
  faqs: string;

  @Column({
    nullable: true
  })
  logo: string;

  @Column({
    nullable: true,
    type: 'text'
  })
  white_logo: string;

  @Column({
    nullable: true
  })
  icon: string;

  @Column({
    nullable: true
  })
  phone_number: string;

  @Column({
    nullable: true,
    type: 'longtext'
  })
  privacy_policy: string;

  @Seed('ke')
  @Column({
    nullable: true,
    default: '254'
  })
  country_code: string

  @Column({
    nullable: true,
    type: 'text'
  })
  return_refunds: string;

  @Column({
    nullable: true,
    type: 'longtext'
  })
  terms_conditions: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  service_fees: string;

  @OneToMany(() => RoleEntity, (roles) => roles.company)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "company_id"
  })
  roles: RoleEntity[];

  @OneToMany(() => UserEntity, (users) => users.company)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "company_id"
  })
  users: UserEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}