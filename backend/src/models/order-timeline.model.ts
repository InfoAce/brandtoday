import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTimelineEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export default class OrderTimelineModel extends Repository<OrderTimelineEntity> {
  constructor(
    @InjectRepository(OrderTimelineEntity)
    private readonly repository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
}
