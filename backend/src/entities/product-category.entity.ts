import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductColourEntity, ProductEntity, SubCategoryEntity } from './index';

@Entity("product_categories")
export class ProductCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity,(category) => category.product_categories, { cascade: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_id",
    referencedColumnName: "id",
  })
  category: CategoryEntity;

  @Column({
    nullable: true
  })
  category_id: string;

  // @ManyToOne(() => ChildSubCategoryEntity,{ onUpdate: "SET NULL", onDelete: 'SET NULL', orphanedRowAction: 'nullify', nullable: true })
  // @JoinColumn({
  //   name:                 "child_sub_category_id",
  //   referencedColumnName: "id",
  // })
  // child_sub_category?: ChildSubCategoryEntity | null;

  @Column({
    nullable: true
  })
  child_sub_category_id: string;

  @ManyToOne(() => ProductEntity,(product) => product.categories, { eager: true, onUpdate: "CASCADE", onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "product_id",
    referencedColumnName: "id",
  })
  product: ProductEntity;

  @Column()
  product_id: string;

  @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.product_categories,  { onUpdate: "SET NULL", onDelete: 'SET NULL', orphanedRowAction: 'nullify', nullable: true })
  @JoinColumn({
    name:                 "sub_category_id",
    referencedColumnName: "id",
  })
  sub_category?: SubCategoryEntity | null;

  @Column({
    nullable: true
  })
  sub_category_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}