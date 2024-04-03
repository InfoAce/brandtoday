import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { AddressBookEntity, RoleEntity, UserEntity } from './index';
import { Seed } from 'nestjs-class-seeder';

export enum Status {
  PAID         = "paid",
  PENDING      = "pending",
  IN_TRANSIT   = "in_transit",
  DELIVERED    = "delivered",
  CANCELLED    = "cencelled",
}

@Entity("orders")
export class OrderEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    type: 'json'
  })
  items: string;

  @Column({
    type:     "enum",
    enum:     Status,
    default:  Status.PENDING,
    nullable: true
  })
  status: string;

  @Column()
  transaction_id: string

  @ManyToOne(() => UserEntity, (entity) => entity.favourites )
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;
  
  @ManyToOne(() => AddressBookEntity, (entity) => entity.orders )
  @JoinColumn({
    name:                 "address_id",
    referencedColumnName: "id",
  })
  address: AddressBookEntity;

  @Column({
    nullable: false
  })
  user_id: string;

  @Column({
    nullable: false
  })
  address_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}