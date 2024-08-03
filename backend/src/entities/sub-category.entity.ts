import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne,OneToMany,  ManyToOne } from 'typeorm';
import { CategoryEntity, ProductEntity } from './index';

@Entity("sub_categories")
export class SubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.sub_categories,{  cascade: true, eager: true, orphanedRowAction: 'nullify' })
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