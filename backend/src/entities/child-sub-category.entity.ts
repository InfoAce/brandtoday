import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne } from 'typeorm';
import { CategoryEntity, ProductEntity, SubCategoryEntity } from './index';

@Entity("child_sub_categories")
export class ChildSubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => SubCategoryEntity, (sub_category) => sub_category.child_sub_categories, { eager: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({
    name:                 "sub_category_id",
    referencedColumnName: "id",
  })
  sub_category: SubCategoryEntity;

  @Column()
  sub_category_id: string;

  @Column()
  name: string;

  @Column()
  path: string;

  // @OneToMany(() => ProductEntity, (product) => product.sub_category, { lazy: true })
  // @JoinColumn({
  //   name:                 "id",
  //   referencedColumnName: "sub_category_id"
  // })
  // products: ProductEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}