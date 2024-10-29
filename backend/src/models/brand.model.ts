import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from '../entities';
import { BrandRepository } from '../repositories';

@Injectable()
export default class BrandModel extends BrandRepository {
  /**
   * BrandModel constructor.
   * 
   * @param brandRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(BrandEntity)
    private brandRepository: BrandRepository,
  ) {
    super(brandRepository.target, brandRepository.manager, brandRepository.queryRunner) 
  }
  
}
