import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { CategoryEntity, PriceEntity, ProductCategoryEntity, SubCategoryEntity } from './index';

@Entity("products")
export class ProductEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
    type: 'json'
  })
  branding_templates: string;

  @Column()
  brand_id: string;

  @OneToMany(() => ProductCategoryEntity, (category) => category.product, { lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "product_id",
  })
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

  @Column()
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
    type: 'json'
  })
  images: string;

  @OneToOne(() => PriceEntity)
  price: PriceEntity;

  @Column({
    type: 'json'
  })
  variants: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}