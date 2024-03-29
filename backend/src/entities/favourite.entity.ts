import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity, UserEntity } from './index';
import { Seed } from 'nestjs-class-seeder';

@Entity("favourites")
export class FavouriteEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    type: 'json'
  })
  content: string;

  @ManyToOne(() => UserEntity, (entity) => entity.favourites )
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: UserEntity;

  @Column({
    nullable: false
  })
  user_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date

}