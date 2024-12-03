import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { BrandingPriceEntity, BrandingEntity } from './index';

@Entity("branding-methods")
export class BrandingMethodEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => BrandingEntity, (entity) => entity.methods, { lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinColumn({
    name:                 "branding_code",
    referencedColumnName: "full_code",
  })
  branding: BrandingEntity;

  @Column()
  branding_code: string;

  @Column()
  @Index()
  code: string;

  @Column()
  colours: string;

  @Column()
  department: string;

  @Column({ unique: true })
  full_code: string;

  @Column()
  name: string;

  @Column()
  max_print_width_size: string;

  @Column()
  max_print_height_size: string;

  @Column()
  multiplier: number;

  @OneToOne(() => BrandingPriceEntity,{ eager: true })
  @JoinColumn()
  price: BrandingPriceEntity;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}