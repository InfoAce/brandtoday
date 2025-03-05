import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, Index } from 'typeorm';
import { OrderEntity, ProductEntity } from './index';

@Entity("brands")
export class BrandEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  code: string;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column({ unique: true })
  path: string;

  @OneToMany( () => ProductEntity,(entity) => entity.branded, { lazy: true })
  @JoinColumn()
  products: ProductEntity[];  

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}