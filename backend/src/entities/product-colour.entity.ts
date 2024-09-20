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

  @ManyToOne(() => ProductEntity, (entity) => entity.colour_images, { onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id'
  })
  product: ProductEntity

  @Column()
  product_id: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}