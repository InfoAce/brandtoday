import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, Index, ManyToOne, OneToMany} from 'typeorm';
import { OrderItemEntity, UserEntity } from '.';

@Entity("quotes")
export class QuoteEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  num_id: number

  @OneToMany(() => OrderItemEntity, entity => entity.quote, { eager: true })
  @JoinColumn()
  items: OrderItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.quotes, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name:                 "user_id",
    referencedColumnName: "id",
  })
  user: Promise<UserEntity>;

  @Column({
    nullable: false
  })
  user_id: string;

  @CreateDateColumn()
  created_at: Date; // Creation date
  
  @UpdateDateColumn()
  updated_at: Date; // Last updated date
  
}