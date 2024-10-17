import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from '../entities';
import { PriceRepository } from '../repositories';
import { DeleteResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { ModelException } from 'src/exceptions/model.exception';

@Injectable()
export default class PriceModel extends PriceRepository {
  /**
   * BrandModel constructor.
   * 
   * @param priceRepository - The brand repository.
   */
  constructor(
    /**
     * The brand repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the PriceEntity.
     */
    @InjectRepository(PriceEntity)
    private priceRepository: PriceRepository,
  ) {
    super(priceRepository.target, priceRepository.manager, priceRepository.queryRunner);
  }

}
