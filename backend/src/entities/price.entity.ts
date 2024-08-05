import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, JoinTable } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity("prices")
export class PriceEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column()
  full_code: string

  @OneToOne(() => ProductEntity)
  @JoinTable({
    name: "product",
    joinColumn:{
      name: "full_code",
      referencedColumnName: "full_code"
    },
    inverseJoinColumn:{
      name: "full_code",
      referencedColumnName: "full_code"
    }
  })
  product: ProductEntity

  @Column()
  simple_code: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}