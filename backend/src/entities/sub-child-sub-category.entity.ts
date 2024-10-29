import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne, Index } from 'typeorm';
import { CategoryEntity, ChildSubCategoryEntity, ProductCategoryEntity, ProductEntity, SubCategoryEntity } from './index';

@Entity("sub-child-sub-categories")
export class SubChildSubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  code: string;

  @ManyToOne(() => ChildSubCategoryEntity, (entity) => entity.sub_categories, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_code",
    referencedColumnName: "code",
  })
  category: ChildSubCategoryEntity;

  @Column()
  category_code: string;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  path: string;

  @OneToMany(() => ProductCategoryEntity, (entity) => entity.child_sub_category_code, { lazy: true } )
  @JoinColumn()
  product_categories: ProductCategoryEntity[];  

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}