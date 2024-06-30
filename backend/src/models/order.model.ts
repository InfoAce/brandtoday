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

  /**
   * Finds a single order entity based on the provided data.
   *
   * @param {object} data - The data used to find the order.
   * @returns {Promise<OrderEntity>} A promise that resolves to the found order.
   * @throws {OrderModelException} Throws an OrderModelException if the order is not found.
   */
  async findOne(data: any): Promise<OrderEntity> {
    try {
      // Finds a single order entity based on the provided data and throws an exception if it is not found.
      return await this.orderRepository.findOneOrFail(data);
    } catch (err) {
      // If the order is not found, throw an OrderModelException.
      throw new OrderModelException(err);  
    }
  }

  /**
   * Finds a single order entity by the provided data.
   *
   * @param {object} data - The data used to find the order.
   * @returns {Promise<OrderEntity>} A promise that resolves to the found order.
   * @throws {OrderModelException} Throws an OrderModelException if the order is not found.
   */
  async findOneBy(data: any): Promise<OrderEntity> {
    try {
      // Find the order entity by the provided data.
      // This method uses the findOneByOrFail method of the OrderRepository to find the order entity.
      return await this.orderRepository.findOneByOrFail(data);
    } catch (err) {
      // If the order is not found, throw an OrderModelException.
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
