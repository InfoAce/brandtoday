import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { FavouriteEntity, OrderItemEntity, ProductCategoryEntity, ProductVariantEntity, StockEntity, StockKeepingEntity } from './index';

@Entity("products")
export class ProductEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  branding_templates: string;

  @OneToMany(() => ProductCategoryEntity, (category) => category.product,{ lazy: true })
  @JoinColumn()
  categories: ProductCategoryEntity[];

  @Column({
    nullable: true,
    type:'json'
  })
  colour_images: string;

  @Column({
    nullable: true,
    type:'json'
  })
  companion_codes: string;

  @Column({
    type: 'longtext'
  })
  description: string;

  @Column({
    nullable: true
  })
  full_branding_guide: string;

  @Column({
    nullable: true
  })
  logo_branding_guide: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  logo_branding: string;

  @Column()
  name: string;

  @Column()
  simple_code: string;

  @Column()
  full_code: string;

  @Column({
    nullable: true
  })
  gender: string;

  @Column({
    type: 'json',
    nullable: true
  })
  images: string;

  @OneToMany( () => FavouriteEntity,(entity) => entity.product, { lazy: true })
  @JoinColumn()
  favourites: FavouriteEntity[];

  @OneToMany( () => OrderItemEntity,(entity) => entity.product, { lazy: true })
  @JoinColumn()
  order_items: OrderItemEntity[];

  @OneToMany( () => StockKeepingEntity,(stock_keeping) => stock_keeping.product, { eager: true })
  @JoinColumn()
  stocks: StockKeepingEntity[];

  @OneToMany(() => ProductVariantEntity,(variants) => variants.product, { eager: true })
  @JoinColumn()
  variants: ProductVariantEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}