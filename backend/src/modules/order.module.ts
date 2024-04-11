import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/entities';
import { OrderModel } from 'src/models';

@Module({
  exports:     [OrderModel],
  imports: [
    TypeOrmModule.forFeature([OrderEntity])
  ],
  providers:   [OrderModel]
})

export class OrderModule {}
