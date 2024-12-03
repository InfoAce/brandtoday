import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandingEntity } from '../entities';
import { BrandingRepository } from '../repositories';

@Injectable()
export default class BrandingModel extends BrandingRepository {
  /**
   * BrandModel constructor.
   * 
   * @param BrandingRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(BrandingEntity)
    private repository: BrandingRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
  
}
