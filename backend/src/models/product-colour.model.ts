import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductColourEntity } from '../entities';
import { ProductColourRepository } from '../repositories';

@Injectable()
export default class ProductColourModel extends ProductColourRepository {
  constructor(
    @InjectRepository(ProductColourEntity)
    private repository: ProductColourRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
}
