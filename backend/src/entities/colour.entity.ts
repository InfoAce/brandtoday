import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, Index } from 'typeorm';
import { OrderEntity, ProductColourEntity, ProductEntity } from './index';

@Entity("colours")
export class ColourEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  amrod_id: string;
  
  @Column()
  @Index()
  code: string;

  @Column({
    type: 'json'
  })
  hexValue: string;

  @Column()
  name: string;

  @Column()
  textColour: string;

  @Column({
    nullable: true
  })
  tickColour: string;

  @OneToMany(() => ProductColourEntity, (entity) => entity.colour, { lazy: true })
  @JoinColumn()
  product_colours: ProductColourEntity[]

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}