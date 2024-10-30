import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, Index, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import { ProductCategoryEntity, ProductEntity, ProductVariantEntity } from '.';

@Entity("product-colours")
export class ProductColourEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column()
  name: string

  @Column({
    type: 'json'
  })
  images: string;

  @Column({
    nullable: true
  })
  hex: string;  

  @ManyToOne(() => ProductEntity, (entity) => entity.colour_images, { onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'product_code',
    referencedColumnName: 'full_code'
  })
  product: ProductEntity

  @Column()
  @Index()
  product_code: string

  @Column({
    unique: true
  })
  simple_code: string;  

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}