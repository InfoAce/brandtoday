import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { CategoryEntity } from './index';

@Entity("sub_categories")
export class SubCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.sub_categories,{ eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
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

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}