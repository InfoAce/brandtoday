import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AddressBookEntity, RoleEntity, TransactionEntity, UserEntity } from './index';
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

  @ManyToOne(() => AddressBookEntity, (entity) => entity.orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "address_id",
    referencedColumnName: "id",
  })
  address: AddressBookEntity;

  @Column({
    nullable: false
  })
  address_id: string;

  @Column({
    nullable: false,
    type: 'json'
  })
  items: any;

  @Column({
    type:     "enum",
    enum:     Status,
    default:  Status.PENDING,
    nullable: true
  })
  status: string;

  @OneToOne(() => TransactionEntity,transaction => transaction.order,{ lazy: true })
  transaction: TransactionEntity

  @ManyToOne(() => UserEntity, (entity) => entity.favourites, { lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @Column({
    nullable: false
  })
  user_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}