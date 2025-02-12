import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AddressBookEntity, OrderEntity, OrderReviewEntity, ProductEntity, QuoteEntity, RoleEntity, TransactionEntity, UserEntity } from './index';

@Entity("order-items")
export class OrderItemEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type:     'tinyint',
    nullable: true,
    default:  false
  })
  branded: boolean;

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
    type:    'json',
    nullable: true
  })
  positions: any;

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

  @ManyToOne(() => ProductEntity, (entity) => entity.order_items, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "full_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;
  
  @ManyToOne(() => OrderEntity, (entity) => entity.items, { orphanedRowAction: 'nullify',onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  order: Promise<OrderEntity>;

  @Column({
    nullable: true
  })
  order_id: string;

  @ManyToOne(() => QuoteEntity, (entity) => entity.items, { orphanedRowAction: 'nullify',onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  @JoinColumn({
    name:                 "quote_id",
    referencedColumnName: "id",
  })
  quote: Promise<QuoteEntity>;

  @Column({
    nullable: true
  })
  quote_id: string;

  @Column({
    type:     'json',
    nullable: true
  })
  sizes: any;
  
  @Column({
    type: 'double',
    nullable: false
  })
  total_amount: number;

  @Column({
    type: 'double',
    nullable: true
  })
  total_branding_cost: number;

  @Column({
    type: 'double',
    nullable: true
  })
  total_setup_cost: number;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}