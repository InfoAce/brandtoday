import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CompanyEntity, OrderEntity, UserEntity } from './index';

@Entity("transactions")
export class TransactionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    type: 'float'
  })
  amount: number;

  @Column({
    nullable: true,
  })
  confirmation_code: string;
  
  @Column({
    nullable: true
  })
  payment_method: string;

  @OneToOne(() => OrderEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  order: OrderEntity;

  @Column({
    unique: true
  })
  order_id: string;

  @Column({
    nullable: true,
  })
  status: string;

  @Column({
    nullable: true,
  })
  status_code: number;
  
  @Column({
    nullable: false,
  })
  tracking_id: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}