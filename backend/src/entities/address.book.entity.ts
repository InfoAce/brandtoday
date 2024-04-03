import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity("address_book")
export class AddressBookEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column()
  county_state: string;

  @Column()
  city_town: string;

  @Column()
  country: string;

  @Column()
  postal_code: string;

  @Column()
  category: string;

  @ManyToOne(() => UserEntity, (entity) => entity.favourites )
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @OneToMany(() => OrderEntity, (entity) => entity.address )
  @JoinColumn({
    name:                 "order_id",
    referencedColumnName: "id",
  })
  orders: OrderEntity[];

  @Column({
    nullable: false
  })
  user_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}