import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AddressBookEntity, OrderEntity, OrderReviewEntity, ProductEntity, RoleEntity, TransactionEntity, UserEntity } from './index';

@Entity("order-items")
export class OrderItemEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  colour: string;

  @Column({
    nullable: false
  })
  full_code: string;

  @Column({
    nullable: true
  })
  hex: string;

  @Column({
    nullable: false
  })
  image: string;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    type: 'double',
    nullable: false
  })
  price: number;

  @Column({
    type: 'numeric',
    nullable: false
  })
  quantity: number;

  @Column({
    nullable: true
  })
  size: string;

  @ManyToOne(() => ProductEntity, (entity) => entity.order_items, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "full_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;
  
  @ManyToOne(() => OrderEntity, (entity) => entity.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  order: Promise<OrderEntity>;

  @Column({
    nullable: false
  })
  order_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}