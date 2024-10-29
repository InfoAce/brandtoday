import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildSubCategoryEntity } from '../entities';
import { ChildSubCategoryRepository } from '../repositories';

@Injectable()
export default class ChildSubCategoryModel extends ChildSubCategoryRepository {
  /**
   * BrandModel constructor.
   * 
   * @param childSubCategoryRepository - The child-sub-product-category repository.
   */
  constructor(
    /**
     * The child-sub-product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ChildSubCategoryEntity.
     */
    @InjectRepository(ChildSubCategoryEntity)
    private childSubCategoryRepository: ChildSubCategoryRepository,
  ) {
    super(childSubCategoryRepository.target, childSubCategoryRepository.manager, childSubCategoryRepository.queryRunner) 
  }

}
