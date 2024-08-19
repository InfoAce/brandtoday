import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductCategoryEntity, ProductEntity } from './index';

@Entity("sub_categories")
export class SubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.sub_categories,{ eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_id",
    referencedColumnName: "id",
  })
  category: CategoryEntity;

  @Column()
  category_id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @OneToMany(() => ChildSubCategoryEntity, (child_sub_category) => child_sub_category.sub_category, { lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "sub_category_id"
  })
  child_sub_categories: ChildSubCategoryEntity[];
  
  @OneToMany(() => ProductCategoryEntity, (product_category) => product_category.sub_category,{ lazy: true } )
  @JoinColumn({
    name: "id",
    referencedColumnName: "sub_category_id"
  })
  product_categories: ProductCategoryEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}