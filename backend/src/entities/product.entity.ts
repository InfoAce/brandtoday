import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { CompanyEntity, FavouriteEntity, OrderItemEntity, ProductCategoryEntity, ProductColourEntity, ProductVariantEntity, StockEntity } from './index';

@Entity("products")
export class ProductEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
  })
  brand: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  branding_templates: string;

  @OneToMany(() => ProductCategoryEntity, (category) => category.product,{ lazy: true })
  @JoinColumn()
  categories: ProductCategoryEntity[];

  @Column({
    unique: true
  })
  code: string;
  
  @OneToMany(() => ProductColourEntity, (entity) => entity.product,{ eager: true })
  @JoinColumn()
  colour_images: ProductColourEntity[];

  @Column({
    nullable: true,
    type:'json'
  })
  companion_codes: string;
  
  @ManyToOne(() => CompanyEntity, (entity) =>  entity.products, { eager: true, onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id'
  })
  company: CompanyEntity
  
  @Column()
  company_id: string

  @Column({
    collation: 'utf8mb4_general_ci',
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

  @Column({
    unique: true
  })
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

  @Column({
    nullable: true,
    type: 'double'
  })
  price: number;

  @Column({
    nullable: true,
    type: 'int'
  })
  stock: number;

  @OneToMany( () => FavouriteEntity,(entity) => entity.product, { lazy: true })
  @JoinColumn()
  favourites: FavouriteEntity[];

  @OneToMany( () => OrderItemEntity,(entity) => entity.product, { lazy: true })
  @JoinColumn()
  order_items: OrderItemEntity[];

  @OneToMany( () => StockEntity,(stock_keeping) => stock_keeping.product, { lazy: true })
  @JoinColumn()
  stocks: StockEntity[];

  @OneToMany(() => ProductVariantEntity,(variants) => variants.product, { lazy: true })
  @JoinColumn()
  variants: ProductVariantEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}