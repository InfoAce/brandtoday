import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariantEntity } from '../entities';
import { ProductVariantRepository } from '../repositories';

@Injectable()
export default class ProductVariantModel extends ProductVariantRepository {
  /**
   * BrandModel constructor.
   * 
   * @param productVariantRepository - The product-category repository.
   */
  constructor(
    /**
     * The product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ProductVariantEntity.
     */
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: ProductVariantRepository,
  ) {
    super(productVariantRepository.target, productVariantRepository.manager, productVariantRepository.queryRunner) 
  }

}
