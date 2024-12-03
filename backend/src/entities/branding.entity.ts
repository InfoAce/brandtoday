import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { BrandingPriceEntity, BrandingMethodEntity, ProductEntity} from './index';

@Entity("branding")
export class BrandingEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ unique: true })
  full_code: string;

  @OneToMany(() => BrandingMethodEntity, (entity) => entity.branding, { eager: true } )
  methods: BrandingMethodEntity[];

  @Column()
  multiplier: number;

  @Column()
  name: string;

  @ManyToOne(() => ProductEntity, (entity) => entity.branding, { lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinColumn({
    name:                 "product_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;

  @Column()
  product_code: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}