import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne, JoinTable, ManyToMany, Index } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductCategoryEntity, ProductEntity } from './index';

@Entity("sub-categories")
export class SubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.sub_categories,{ eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_code",
    referencedColumnName: "code",
  })
  category: CategoryEntity;

  @Column()
  category_code: string;

  @Column()
  @Index()
  code: string;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  path: string;

  @OneToMany(() => ChildSubCategoryEntity, (entity) => entity.category, { lazy: true })
  @JoinColumn({
    name:                 "code",
    referencedColumnName: "category_code"
  })
  sub_categories: ChildSubCategoryEntity[];
  
  @OneToMany(() => ProductCategoryEntity, (product_category) => product_category.sub_category,{ lazy: true } )
  @JoinColumn({
    name: "code",
    referencedColumnName: "sub_category_code"
  })
  product_categories: ProductCategoryEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}