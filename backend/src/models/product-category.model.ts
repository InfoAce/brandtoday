import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from '../entities';
import { ProductCategoryRepository } from '../repositories';

@Injectable()
export default class ProductCategoryModel extends ProductCategoryRepository {
  /**
   * BrandModel constructor.
   * 
   * @param productCategorytRepository - The product-category repository.
   */
  constructor(
    /**
     * The product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ProductCategoryEntity.
     */
    @InjectRepository(ProductCategoryEntity)
    private productCategorytRepository: ProductCategoryRepository,
  ) {
    super(productCategorytRepository.target, productCategorytRepository.manager, productCategorytRepository.queryRunner) 
  }
  
}
