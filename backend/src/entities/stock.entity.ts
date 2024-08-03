import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

@Entity("stocks")
export class StockEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  colour_code: string;

  @Column()
  name: string;

  @Column()
  full_code: string;

  @Column({
    type: 'json',
    nullable: true
  })
  incoming_quantity: string;

  @Column()
  quantity: number;

  @Column()
  reserved_quantity: number;

  @Column()
  simple_code: string;

  @Column()
  type: number;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}