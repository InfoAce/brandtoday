import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, OrderItemEntity } from 'src/entities';
import { OrderCreatedListener, OrderPaidListener } from 'src/listeners';
import { OrderItemModel, OrderModel } from 'src/models';

@Module({
  exports:     [
    OrderModel,
    OrderItemModel
  ],
  imports: [
    TypeOrmModule.forFeature([OrderEntity,OrderItemEntity])
  ],
  providers:   [
    OrderModel,
    OrderItemModel,
    OrderCreatedListener,
    OrderPaidListener
  ]
})

export class OrderModule {}
