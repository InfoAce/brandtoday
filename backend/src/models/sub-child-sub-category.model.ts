import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubChildSubCategoryEntity } from '../entities';
import { SubChildSubCategoryRepository } from '../repositories';
@Injectable()
export default class SubChildSubCategoryModel extends SubChildSubCategoryRepository {
  /**
   * BrandModel constructor.
   * 
   * @param subChildSubCategoryRepository - The child-sub-product-category repository.
   */
  constructor(
    /**
     * The child-sub-product-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the ChildSubCategoryEntity.
     */
    @InjectRepository(SubChildSubCategoryEntity)
    private subChildSubCategoryRepository: SubChildSubCategoryRepository,
  ) {
    super(subChildSubCategoryRepository.target, subChildSubCategoryRepository.manager, subChildSubCategoryRepository.queryRunner) 
  }

}
