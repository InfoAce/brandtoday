import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductEntity, ProductVariantEntity, StockEntity, SubCategoryEntity } from './index';

@Entity("stock_keeping")
export class StockKeepingEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => ProductEntity,(product) => product.stocks, {  onUpdate: "CASCADE", onDelete: 'SET NULL' })
  @JoinColumn({
    name:                 "product_id",
    referencedColumnName: "id",
  })
  product: ProductEntity;

  @Column({
    nullable: true
  })
  product_id: string;

  @ManyToOne(() => ProductVariantEntity, (variant) => variant.stocks, { onUpdate: "CASCADE", onDelete: 'SET NULL' })
  @JoinColumn({
    name:                 "variant_id",
    referencedColumnName: "id",
  })
  variant: ProductVariantEntity;

  @Column({
    nullable: true
  })
  variant_id: string;
  
  @ManyToOne(() => StockEntity,(stock) => stock.stock_keeping, { eager: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "stock_id",
    referencedColumnName: "id",
  })
  stock: StockEntity;

  @Column()
  stock_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}