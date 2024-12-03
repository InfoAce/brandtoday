import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandingMethodEntity } from '../entities';
import { BrandingMethodRepository } from '../repositories';

@Injectable()
export default class BrandingMethodModel extends BrandingMethodRepository {
  /**
   * BrandModel constructor.
   * 
   * @param BrandingMethodRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(BrandingMethodEntity)
    private repository: BrandingMethodRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
  
}
