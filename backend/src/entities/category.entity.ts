import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne, Index } from 'typeorm';
import { ProductCategoryEntity, SubCategoryEntity } from './index';

@Entity("categories")
export class CategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  path: string;

  @Column({
    type: 'boolean', 
    nullable: true,
    default: true
  })
  show: boolean;

  @Column({
    type: 'int', 
    nullable: true,
    default: 1 
  })
  priority: number;

  @OneToMany(() => ProductCategoryEntity, (product_categories) => product_categories.category, { lazy: true })
  @JoinColumn({
    name:                 "code",
    referencedColumnName: "category_code"
  })
  product_categories: ProductCategoryEntity;

  @OneToMany(() => SubCategoryEntity, (product) => product.category, { lazy: true })
  @JoinColumn({
    name:                 "code",
    referencedColumnName: "category_code"
  })
  sub_categories: SubCategoryEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}