import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities';
import { DeleteResult } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { OrderRepository } from 'src/repositories';

class OrderModelException extends ExceptionsHandler {}

@Injectable()
export default class OrderModel {

  private readonly logger = new Logger(OrderModel.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: OrderRepository,
  ) {}
  
  async find(data:any): Promise<OrderEntity[]>{
    try{
      return await this.orderRepository.find(data);
    } catch(error){
      this.logger.error(error);
    }
  }

  async findOne(data:any): Promise<OrderEntity>{
    try{
      return await this.orderRepository.findOneOrFail(data);
    } catch(err) {
      throw new OrderModelException(err);   
    }
  }

  async paginate(options: IPaginationOptions, data: any = {}): Promise<Pagination<OrderEntity>> {
    return paginate<OrderEntity>(this.orderRepository, options, data);
  }


  async updateOne(id: string, data: any): Promise<any>{
    return await this.orderRepository.update({id},data);
  }

  async save(data: any): Promise<any>{
    try {
      return await this.orderRepository.save(data);
    } catch(err){
      throw new OrderModelException(err);   
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.orderRepository.delete(id);
  }
}
