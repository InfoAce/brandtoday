import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { CategoryEntity, ProductEntity, SubCategoryEntity } from './index';

@Entity("product_categories")
export class ProductCategoryEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CategoryEntity,{ cascade: true, eager: true, orphanedRowAction: 'nullify'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                })
  @JoinColumn({
    name:                 "category_id",
    referencedColumnName: "id",
  })
  category: CategoryEntity;

  @Column({
    nullable: true
  })
  category_id: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({
    name:                 "product_id",
    referencedColumnName: "id",
  })
  product: ProductEntity;

  @Column()
  product_id: string;

  @ManyToOne(() => SubCategoryEntity,{ eager: true })
  @JoinColumn({
    name:                 "id",
    referencedColumnName: "category_id",
  })
  sub_categories: SubCategoryEntity[];

  @Column({
    nullable: true
  })
  sub_category_id: string;

  @Column()
  full_code: string

  @Column()
  simple_code: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}