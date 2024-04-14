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
export default class TransactionModel {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: TransactionRepository,
  ) {}
  
  async find(data:any): Promise<TransactionEntity[]>{
    return await this.transactionRepository.find(data);
  }

  async findOne(data:any): Promise<TransactionEntity>{
    try{
      return await this.transactionRepository.findOneOrFail(data);
    } catch(err) {
      throw new TranscationModelException(err);   
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<TransactionEntity>> {
    return paginate<TransactionEntity>(this.transactionRepository, options);
  }


  async updateOne(id: string, data: any): Promise<any>{
    return await this.transactionRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    try {
      return await this.transactionRepository.save(data);
    } catch(err){
      throw new TranscationModelException(err);   
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.transactionRepository.delete(id);
  }
}
