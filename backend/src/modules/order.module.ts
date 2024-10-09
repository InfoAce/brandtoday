import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, OrderItemEntity, OrderReviewEntity, OrderTimelineEntity } from 'src/entities';
import { OrderCreatedListener, OrderPaidListener } from 'src/listeners';
import { OrderItemModel, OrderModel, OrderTimelineModel } from 'src/models';

@Module({
  exports:  [
    OrderModel,
    OrderItemModel,
    OrderTimelineModel
  ],
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      OrderTimelineEntity
    ])
  ],
  providers:   [
    OrderModel,
    OrderItemModel,
    OrderTimelineModel,
    OrderCreatedListener,
    OrderPaidListener
  ]
})

export class OrderModule {}
