import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { OrderEntity } from './index';
import { Faker } from '@faker-js/faker';
import { Seed, SeederContext } from 'nestjs-class-seeder';
import { has } from 'lodash';

export enum STATUS {
    COMPLETE = "complete",
    FAILED   = "failed",
    PENDING  = "pending",
    WAITING  = "waiting",
}
@Entity("queues")
export class QueueEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true
  })
  message: string;

  @Seed((faker: Faker, { previousRecord }: SeederContext) => {
    if( !has(previousRecord,'first_name') ){
      switch(previousRecord.type){
        case 'categories':
          return 'products';
        case 'prices':
          return null;
        case 'brands':
          return 'categories';
        case 'products':
          return 'products';
      }
    }
  })
  @Column({
    nullable: true
  })
  parent: string;

  @Seed((faker: Faker, { previousRecord }: SeederContext) => {
    if( has(previousRecord,'first_name') ){
      return 'categories'
    }
    if( !has(previousRecord,'first_name') ){
      switch(previousRecord.type){
        case 'categories':
          return 'prices';
        case 'prices':
          return 'brands';
        case 'brands':
          return 'products';
        case 'products':
          return 'stocks';
      }
    }
  })
  @Column()
  type: string;

  @Column({
    type:    'tinyint',
    default:  0
  })
  state: boolean

  @Column({
    type:     "enum",
    enum:     STATUS,
    default:  STATUS.WAITING,
  })
  status: string

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}