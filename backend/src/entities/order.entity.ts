import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AddressBookEntity, OrderItemEntity, OrderReviewEntity, RoleEntity, TransactionEntity, UserEntity } from './index';
import { Seed } from 'nestjs-class-seeder';
import { OrderTimelineEntity } from './order-timeline.entity';

export enum Status {
  PAID         = "paid",
  PENDING      = "pending",
  CONFIRMED    = "confirmed",
  IN_TRANSIT   = "in_transit",
  DELIVERED    = "delivered",
  CANCELLED    = "cancelled",
}

@Entity("orders")
export class OrderEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AddressBookEntity, (entity) => entity.orders, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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
    nullable: false
  })
  num_id: string;

  @Column({
    type:     "enum",
    enum:     Status,
    default:  Status.PENDING,
    nullable: true
  })
  status: string;

  @Column({
    type:     'boolean',
    nullable: true,
    default:  false
  })
  saved: boolean;

  @OneToMany(() => OrderTimelineEntity, timeline => timeline.order)
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "order_id",
  })
  timelines: OrderTimelineEntity[];

  @OneToMany(() => OrderItemEntity, entity => entity.order, { eager: true })
  @JoinColumn()
  items: OrderItemEntity[];

  @OneToOne(() => TransactionEntity,transaction => transaction.order,{ eager: true })
  transaction: TransactionEntity

  @OneToOne(() => OrderReviewEntity,review => review.order,{ eager: true })
  review: OrderReviewEntity

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: Promise<UserEntity>;

  @Column({
    nullable: false
  })
  user_id: string;

  @CreateDateColumn({ type: 'datetime'})
  created_at: string; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}