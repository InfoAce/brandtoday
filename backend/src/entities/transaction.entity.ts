import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyEntity, OrderEntity, UserEntity } from './index';
import { Seed, SeederContext, SeedEnum, SeedRelation} from 'nestjs-class-seeder';
import { Faker } from "@faker-js/faker";
import { get, keys } from 'lodash';

@Entity("transactions")
export class TransactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  confirmation_code: string;
  
  @Column({
    nullable: true
  })
  payment_method: string;

  @OneToOne(() => OrderEntity, (order) => order.transaction,{ eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  order: OrderEntity;

  @Column({
    unique: false
  })
  order_id: string;

  @Column({
    nullable: false,
  })
  status: string;

  @Column({
    nullable: false,
  })
  status_code: number;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}