import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne, Index } from 'typeorm';
import { CategoryEntity, ProductCategoryEntity, ProductEntity, SubCategoryEntity, SubChildSubCategoryEntity } from './index';

@Entity("child-sub-categories")
export class ChildSubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  code: string;

  @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.sub_categories, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "category_code",
    referencedColumnName: "code",
  })
  category: SubCategoryEntity;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  path: string;

  @Column({
    nullable: true,
  })
  category_code: string;

  @OneToMany(() => ProductCategoryEntity, (entity) => entity.child_sub_category, { lazy: true } )
  @JoinColumn()
  product_categories: ProductCategoryEntity[];  

  @OneToMany(() => SubChildSubCategoryEntity, (entity) => entity.category, { lazy: true } )
  @JoinColumn()
  sub_categories: SubChildSubCategoryEntity[];  

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}