import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, Index, ManyToOne} from 'typeorm';
import { ProductVariantEntity } from './';

@Entity("prices")
export class PriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column()
  @Index()
  full_code: string

  @ManyToOne(() => ProductVariantEntity, (variant) =>  variant.price,{ onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'full_code',
    referencedColumnName: 'full_code'
  })
  variant: ProductVariantEntity

  @Column()
  simple_code: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}