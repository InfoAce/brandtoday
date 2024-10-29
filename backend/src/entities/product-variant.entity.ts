import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne, JoinTable, ManyToMany, Index } from 'typeorm';
import { PriceEntity, ProductEntity, StockEntity } from './index';

@Entity("product-variants")
export class ProductVariantEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  code_colour: string;

  @Column({
    nullable: true
  })
  code_colour_name: string;

  @Column({
    nullable: true,
  })
  code_size: string;

  @Column({
    nullable: true,
  })
  code_size_name: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  categorized_attribute: string;

  @Column({
    type: "json"
  })
  packaging_and_dimension: string;

  @Column({
    type: 'json'
  })
  product_dimension: string;

  @Column()
  is_logo_24: boolean;

  @Column({
    nullable: true,
    type: "json"
  })
  components: string;

  @Column()
  @Index({ unique: true })
  full_code: string;

  @Column()
  simple_code: string;

  @ManyToOne(() => ProductEntity, (product) => product.variants, { lazy: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "simple_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;

  @OneToOne( () => PriceEntity, (price) =>  price.variant, { eager: true })
  price: PriceEntity;

  @OneToOne( () => StockEntity,(stock_keeping) => stock_keeping.variant, { eager: true })
  stock: StockEntity;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}