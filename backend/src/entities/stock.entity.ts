import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { ProductVariantEntity } from './product-variant.entity';
import { ProductEntity } from './product.entity';

@Entity("stocks")
export class StockEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  colour_code: string;

  @Column({
    unique: true
  })
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

  @ManyToOne(() => ProductEntity, (product) => product.variants, { lazy: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "simple_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;

  @Column()
  type: number;

  @ManyToOne(() => ProductVariantEntity, (entity) => entity.stock, { lazy: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "full_code",
    referencedColumnName: "full_code",
  })
  variant: ProductVariantEntity;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}