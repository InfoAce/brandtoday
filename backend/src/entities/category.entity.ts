import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { OrderEntity } from './index';
import { SubCategoryEntity } from './sub-category.entity';

@Entity("categories")
export class CategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @ManyToOne(() => SubCategoryEntity,{ lazy: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "category_id",
  })
  sub_categories: SubCategoryEntity[];

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}