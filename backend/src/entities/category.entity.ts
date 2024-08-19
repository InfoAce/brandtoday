import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { ProductCategoryEntity, SubCategoryEntity } from './index';

@Entity("categories")
export class CategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @OneToMany(() => ProductCategoryEntity, (product_categories) => product_categories.category, { lazy: true })
  @JoinColumn()
  product_categories: ProductCategoryEntity;

  @OneToMany(() => SubCategoryEntity, (product) => product.category, { lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "category_id",
  })
  sub_categories: SubCategoryEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}