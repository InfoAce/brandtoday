import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, Index, ManyToOne} from 'typeorm';
import { CompanyEntity, ProductVariantEntity } from './';

@Entity("prices")
export class PriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'double'
  })
  amount: number;

  @Column({
    unique: true
  })
  full_code: string

  @ManyToOne(() => CompanyEntity, (entity) =>  entity.prices, { eager: true, onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id'
  })
  company: CompanyEntity
  
  @Column()
  company_id: string

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