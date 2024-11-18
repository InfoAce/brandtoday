import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuoteEntity } from '../entities';
import { QuoteRepository } from '../repositories';

@Injectable()
export default class QuoteModel extends QuoteRepository {
/**
 * BrandModel constructor.
 * 
 * @param repository - The product repository.
 */
constructor(
  /**
   * The product repository.
   * This repository is injected by NestJS using the @InjectRepository decorator.
   * It is used to perform database operations related to the ProductEntity.
   */
  @InjectRepository(QuoteEntity)
  private repository: QuoteRepository,
) {
  super(repository.target, repository.manager, repository.queryRunner) 
}

}
