import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { OrderEntity } from './index';

@Entity("order-reviews")
export class OrderReviewEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @OneToOne(() => OrderEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  order: OrderEntity;

  @Column()
  order_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}