import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, JoinTable } from 'typeorm';
import { ProductVariantEntity } from './';

@Entity("prices")
export class PriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column()
  full_code: string
  
  @Column()
  variant_id: string

  @OneToOne(() => ProductVariantEntity,(variant) => variant.price, { onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinColumn({
    name: 'variant_id',
    referencedColumnName: 'id'
  })
  variant: ProductVariantEntity

  @Column()
  simple_code: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}