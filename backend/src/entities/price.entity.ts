import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, Index, ManyToOne} from 'typeorm';
import { CompanyEntity, ProductVariantEntity } from './';

@Entity("prices")
export class PriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column({
    nullable: true
  })
  @Index()
  full_code: string

  @ManyToOne(() => CompanyEntity, (entity) =>  entity.prices, { eager: true, onDelete:"CASCADE", onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id'
  })
  company: CompanyEntity
  
  @Column()
  company_id: string

  @ManyToOne(() => ProductVariantEntity, (variant) =>  variant.price,{ orphanedRowAction: 'nullify', onDelete:"SET NULL", onUpdate: 'CASCADE' })
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