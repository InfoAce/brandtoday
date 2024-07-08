import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReviewEntity, RoleEntity } from '../entities';
import { OrderReviewRepository } from '../repositories';

@Injectable()
export default class ProductReviewModel extends OrderReviewRepository {
  constructor(
    @InjectRepository(OrderReviewEntity)
    private repository: OrderReviewRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
}
