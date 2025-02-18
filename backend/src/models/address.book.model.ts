import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressBookEntity, FavouriteEntity } from '../entities';
import { DeleteResult } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AddressBookRepository } from 'src/repositories';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

class AddressBookModelException extends ExceptionsHandler {}

@Injectable()
export default class AddressBookModel extends AddressBookRepository {
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
    @InjectRepository(AddressBookEntity)
    private repository: AddressBookRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner) 
  }
}
