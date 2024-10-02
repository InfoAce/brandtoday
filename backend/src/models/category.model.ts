import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities';
import { CategoryRepository } from '../repositories';

@Injectable()
export default class CategoryModel extends CategoryRepository {
  /**
   * BrandModel constructor.
   * 
   * @param categoryRepository - The category repository.
   */
  constructor(
    /**
     * The category repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the CategoryEntity.
     */
    @InjectRepository(CategoryEntity)
    private categoryRepository: CategoryRepository,
  ) {
    super(categoryRepository.target, categoryRepository.manager, categoryRepository.queryRunner) 
  }
  
}
