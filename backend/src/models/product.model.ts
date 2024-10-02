import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities';
import { ProductRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class ProductModel extends ProductRepository {
/**
 * BrandModel constructor.
 * 
 * @param productRepository - The product repository.
 */
constructor(
  /**
   * The product repository.
   * This repository is injected by NestJS using the @InjectRepository decorator.
   * It is used to perform database operations related to the ProductEntity.
   */
  @InjectRepository(ProductEntity)
  private productRepository: ProductRepository,
) {
  super(productRepository.target, productRepository.manager, productRepository.queryRunner) 
}

}
