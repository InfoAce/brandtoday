import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BrandingMethodEntity } from './index';

@Entity("branding-prices")
export class BrandingPriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => BrandingMethodEntity, (entity) => entity.price,{ orphanedRowAction: 'nullify', cascade: true, nullable: true } )
  @JoinColumn({ name: "code", referencedColumnName: 'code' })
  branding: BrandingMethodEntity;

  @Column({ nullable: true })
  code: string;

  @Column()
  colours: string;

  @Column({ unique: true })
  full_code: string;

  @Column()
  min_quantity: number;

  @Column()
  max_quantity: number;

  @Column({ type: 'double' })
  setup: number;

  @Column({ type: 'double'})
  price: number;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}