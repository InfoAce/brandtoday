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
  @Index()
  simple_code: string;

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

  @Column({ nullable: true, type: 'numeric' })
  min_quantity: number;

  @Column({ nullable: true, type: 'numeric' })
  max_quantity: number;

  @Column({ nullable: true, type: 'double' })
  setup: number;

  @Column({ nullable: true, type: 'double'})
  price: number;

  // @ManyToOne(() => BrandingPriceEntity, (entity) => entity.methods, { eager: true, onDelete: 'CASCADE', onUpdate:'CASCADE'})
  // @JoinColumn({ name: "code", referencedColumnName: 'code' })
  // price: BrandingPriceEntity;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}