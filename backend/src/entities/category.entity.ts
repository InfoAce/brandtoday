import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { ProductCategoryEntity, SubCategoryEntity } from './index';

@Entity("categories")
export class CategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @OneToMany(() => ProductCategoryEntity, (product) => product.category, { lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "category_id"
  })
  products: ProductCategoryEntity[];

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