import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { RoleEntity, UserEntity } from './index';
import { Seed } from 'nestjs-class-seeder';

@Entity("orders")
export class OrderEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  address: string;

  @Seed('Test Company')
  @Column()
  name: string;

  @Seed('info@company.com')
  @Column({
    unique: true
  })
  email: string

  @Column({
    nullable: true
  })
  logo: string;

  @Column({
    nullable: true
  })
  icon: string;

  @Column({
    nullable: true
  })
  phone_number: string;

  @Seed('ke')
  @Column({
    nullable: true,
    default: '254'
  })
  country_code: string

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