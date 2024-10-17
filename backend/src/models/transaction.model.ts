import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entities';
import { DeleteResult } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { TransactionRepository } from 'src/repositories';

class TranscationModelException extends ExceptionsHandler {}

@Injectable()
export default class TransactionModel extends TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: TransactionRepository,
  ) {
    super(transactionRepository.target, transactionRepository.manager, transactionRepository.queryRunner);
  }
}
