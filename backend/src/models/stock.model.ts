import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from '../entities';
import { StockRepository } from '../repositories';

@Injectable()
export default class StockModel extends StockRepository {
  /**
   * BrandModel constructor.
   * 
   * @param stockRepository - The stock repository.
   */
  constructor(
    /**
     * The stock repository.
     * This repository is injected by NestJS using the @InjectRepository decorator.
     * It is used to perform database operations related to the StockEntity.
     */
    @InjectRepository(StockEntity)
    private stockRepository: StockRepository,
  ) {
    super(stockRepository.target, stockRepository.manager, stockRepository.queryRunner) 
  }
  
}
