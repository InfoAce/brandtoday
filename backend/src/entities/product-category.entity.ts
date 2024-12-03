import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, JoinTable, ManyToMany, OneToMany, Index } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductColourEntity, ProductEntity, SubCategoryEntity, SubChildSubCategoryEntity } from './index';

@Entity("product-categories")
export class ProductCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity,(category) => category.product_categories, { cascade: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_code",
    referencedColumnName: "code",
  })
  category: CategoryEntity;

  @Column({
    nullable: true
  })
  @Index()
  category_code: string;

  @ManyToOne(() => ChildSubCategoryEntity, (entity) => entity.product_categories, { onUpdate: "SET NULL", onDelete: 'SET NULL', orphanedRowAction: 'nullify', nullable: true })
  @JoinColumn({
    name:                 "child_sub_category_code",
    referencedColumnName: "code",
  })
  child_sub_category: ChildSubCategoryEntity | null;

  @Column({
    nullable: true
  })
  @Index()
  child_sub_category_code: string;

  @Column({
    unique: true
  })
  path: string;

  @ManyToOne(() => ProductEntity,(product) => product.categories, { lazy: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "product_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;

  @Column()
  product_code: string;

  @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.product_categories,  { onUpdate: "SET NULL", onDelete: 'SET NULL', orphanedRowAction: 'nullify', nullable: true })
  @JoinColumn({
    name:                 "sub_category_code",
    referencedColumnName: "code",
  })
  sub_category: SubCategoryEntity | null;

  @Column({
    nullable: true
  })
  @Index()
  sub_category_code: string;

  @ManyToOne(() => SubChildSubCategoryEntity, (entity) => entity.product_categories, { onUpdate: "SET NULL", onDelete: 'SET NULL', orphanedRowAction: 'nullify' })
  @JoinColumn({
    name:                 "sub_child_sub_category_code",
    referencedColumnName: "code",
  })
  sub_child_sub_category: SubChildSubCategoryEntity;

  @Column({
    nullable: true
  })
  @Index()
  sub_child_sub_category_code: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}