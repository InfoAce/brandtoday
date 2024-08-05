import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductEntity, SubCategoryEntity } from './index';

@Entity("product_categories")
export class ProductCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity,{ cascade: true, onUpdate: "CASCADE", onDelete: 'SET NULL', eager: true, orphanedRowAction: 'nullify' })
  @JoinColumn({
    name:                 "category_id",
    referencedColumnName: "id",
  })
  category: CategoryEntity;

  @Column({
    nullable: true
  })
  category_id: string;

  @ManyToOne(() => ChildSubCategoryEntity,{ cascade: true, onUpdate: "CASCADE", onDelete: 'SET NULL', eager: true, orphanedRowAction: 'nullify' })
  @JoinColumn({
    name:                 "child_sub_category_id",
    referencedColumnName: "id",
  })
  child_sub_categories: ChildSubCategoryEntity;

  @Column({
    nullable: true
  })
  child_sub_category_id: string;

  @ManyToOne(() => ProductEntity,(product) => product.categories, { onUpdate: "CASCADE", onDelete: 'CASCADE', eager: true })
  @JoinColumn({
    name:                 "product_id",
    referencedColumnName: "id",
  })
  product: ProductEntity;

  @Column()
  product_id: string;

  @ManyToOne(() => SubCategoryEntity,{ onUpdate: "CASCADE", onDelete: 'SET NULL', eager: true })
  @JoinColumn({
    name:                 "sub_category_id",
    referencedColumnName: "id",
  })
  sub_category: SubCategoryEntity;

  @Column({
    nullable: true
  })
  sub_category_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}