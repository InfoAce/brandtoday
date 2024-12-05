import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, Index } from 'typeorm';
import { BrandingMethodEntity } from './index';

@Entity("branding-prices")
export class BrandingPriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  code: string;

  @Column()
  colours: string;

  @Column({ unique: true })
  full_code: string;

  // @OneToMany(() => BrandingMethodEntity, (entity) => entity.price,{ lazy: true } )
  // @JoinColumn({ name: "code", referencedColumnName: 'code' })
  // methods: BrandingMethodEntity[];

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