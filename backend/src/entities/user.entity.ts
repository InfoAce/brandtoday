import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, AfterLoad, OneToMany } from 'typeorm';
import { AddressBookEntity, CompanyEntity, OrderEntity, QuoteEntity, RoleEntity } from './index';
import { Seed, SeederContext, SeedRelation } from 'nestjs-class-seeder';
import { Faker } from "@faker-js/faker";
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { FavouriteEntity } from './favourite.entity';

export enum Gender {
  MALE         = "male",
  FEMALE       = "female",
  PREFERNOTSAY = "",
}

@Entity("users")
export class UserEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @OneToMany(() => AddressBookEntity, (favourites) => favourites.user)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "user_id"
  })
  address_book: Promise<AddressBookEntity[]>;

  @SeedRelation(() => CompanyEntity, (ctx, entities) => entities[ctx.currentIndex])
  @ManyToOne(() => CompanyEntity, (company) => company.users,{ eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "company_id",
    referencedColumnName: "id",
  })
  company: CompanyEntity;

  @Column()
  company_id: string;

  @Seed('Root')
  @Column()
  first_name: string;

  @Seed('User')
  @Column()
  last_name: string;

  @Seed('super@app.com')
  @Column({
    unique: true
  })
  email: string

  @Seed('254')
  @Column({
    nullable: true,
    default: '254'
  })
  country_code: string

  @Seed('KES')
  @Column({
    nullable: true,
    default: 'KES'
  })
  currency: string

  @Seed(new Date())
  @Column({
    nullable: true
  })
  email_verified_at: string

  @Column({
    type:     "enum",
    enum:     Gender,
    default:  Gender.PREFERNOTSAY,
    nullable: true
  })
  gender: string;

  @OneToMany(() => FavouriteEntity, (favourites) => favourites.user, { lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "user_id"
  })
  favourites: FavouriteEntity[];

  @Column({
    nullable: true
  })
  image: string;

  @Seed( 
    async(faker: Faker, ctx: SeederContext) => {
      return bcrypt.hash('password', 10);
    }
  )
  @Column({
    select: false
  })
  password: string;

  @Column({
    nullable: true
  })
  phone_number: string;

  @OneToMany(() => OrderEntity, (order) => order.user)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "user_id"
  })
  orders: OrderEntity[];

  @OneToMany(() => QuoteEntity, (order) => order.user)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "user_id"
  })
  quotes: QuoteEntity[];
  
  @SeedRelation(() => RoleEntity, (ctx, entities) => entities[ctx.currentIndex])
  @ManyToOne(() => RoleEntity, (role) => role.users,{ eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({
    name:                 "role_id",
    referencedColumnName: "id",
  })
  role: RoleEntity;

  @Column()
  role_id: string;

  @Seed((faker: Faker, ctx: SeederContext) => require("randomstring").generate(100))
  @Column()
  token: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
  @DeleteDateColumn()
  deleted_at: Date; // Deletion date   

}