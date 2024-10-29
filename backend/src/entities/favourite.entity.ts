import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity, RoleEntity, UserEntity } from './index';
import { Seed } from 'nestjs-class-seeder';

@Entity("favourites")
export class FavouriteEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column({
    nullable: false
  })
  full_code: string;

  @ManyToOne(() => ProductEntity, (entity) => entity.favourites, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinColumn({
    name:                 "full_code",
    referencedColumnName: "full_code",
  })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.favourites, { onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
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