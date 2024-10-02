import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoryEntity } from '../entities';
import { SubCategoryRepository } from '../repositories';

@Injectable()
export default class SubCategoryModel extends SubCategoryRepository{
  /**
   * BrandModel constructor.
   * 
   * @param subCategoryRepository - The sub-category repository.
   */
  constructor(
    /**
     * The sub-category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the SubCategoryEntity.
     */
    @InjectRepository(SubCategoryEntity)
    private subCategoryRepository: SubCategoryRepository,
  ) {
    super(subCategoryRepository.target, subCategoryRepository.manager, subCategoryRepository.queryRunner) 
  }
  
}
