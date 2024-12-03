import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandingPriceEntity } from '../entities';
import { BrandingPriceRepository } from '../repositories';

@Injectable()
export default class BrandingPriceModel extends BrandingPriceRepository {
  /**
   * BrandModel constructor.
   * 
   * @param BrandingPriceRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the BrandEntity.
     */
    @InjectRepository(BrandingPriceEntity)
    private repository: BrandingPriceRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
  
}
