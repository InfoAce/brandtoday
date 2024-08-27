import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemEntity } from '../entities';
import { OrderItemRepository } from '../repositories';

@Injectable()
export default class OrderItemModel extends OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private repository: OrderItemRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
}
