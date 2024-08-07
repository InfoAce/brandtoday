import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { ProductVariantEntity } from './product-variant.entity';
import { ProductEntity } from './product.entity';
import { StockKeepingEntity } from './stock-keeping.entity';

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

  @OneToOne(() => StockKeepingEntity,(product) => product.stock, { lazy: true } )
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id'
  })
  stock_keeping: StockKeepingEntity[]

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}