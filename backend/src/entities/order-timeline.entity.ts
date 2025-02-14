import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { OrderEntity } from './index';

@Entity("order-timelines")
export class OrderTimelineEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
  description: string;

  @Column()
  name: string;

  @ManyToOne(() => OrderEntity, order => order.timelines, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
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